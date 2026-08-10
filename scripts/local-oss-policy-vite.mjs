import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import ossUploadPolicy from '../netlify/functions/oss-upload-policy.mjs';

const POLICY_PATH = '/.netlify/functions/oss-upload-policy';
const SERVER_ENV_KEYS = [
  'OSS_ACCESS_KEY_ID',
  'OSS_ACCESS_KEY_SECRET',
  'OSS_BUCKET',
  'OSS_REGION',
  'OSS_ENDPOINT',
  'OSS_MAX_FILE_SIZE_MB',
  'OSS_PUBLIC_BASE_URL',
  'OSS_ALLOWED_ORIGINS',
];

function loadPrivateLocalEnv() {
  let localEnv;
  try {
    localEnv = parseEnv(readFileSync(new URL('../.env', import.meta.url), 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }

  // Explicitly prefer the project-local file. This prevents an unrelated
  // inherited OSS credential from silently overriding the selected RAM user.
  for (const key of SERVER_ENV_KEYS) {
    if (localEnv[key] !== undefined) process.env[key] = localEnv[key];
  }
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

export function localOssPolicy() {
  return {
    name: 'local-oss-upload-policy',
    apply: 'serve',
    configureServer(server) {
      loadPrivateLocalEnv();

      server.middlewares.use(POLICY_PATH, async (request, response) => {
        try {
          const body = request.method === 'GET' || request.method === 'HEAD'
            ? undefined
            : await readRequestBody(request);
          const origin = request.headers.origin || `http://${request.headers.host || 'localhost:4321'}`;
          const headers = new Headers();
          for (const [name, value] of Object.entries(request.headers)) {
            if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
            else if (value !== undefined) headers.set(name, value);
          }
          headers.set('origin', origin);

          const webRequest = new Request(`http://${request.headers.host || 'localhost:4321'}${POLICY_PATH}`, {
            method: request.method,
            headers,
            body,
          });
          const webResponse = await ossUploadPolicy(webRequest);
          response.statusCode = webResponse.status;
          webResponse.headers.forEach((value, name) => response.setHeader(name, value));
          response.end(Buffer.from(await webResponse.arrayBuffer()));
        } catch (error) {
          console.error('[local-oss-upload-policy]', error);
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ message: 'Local OSS policy server failed.' }));
        }
      });
    },
  };
}
