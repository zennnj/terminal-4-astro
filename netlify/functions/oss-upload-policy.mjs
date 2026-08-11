import { createHmac, randomUUID } from 'node:crypto';

const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function hmac(key, value) {
  return createHmac('sha256', key).update(value, 'utf8').digest();
}

function requestOriginAllowed(origin) {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      return true;
    }
  } catch {
    return false;
  }

  const configured = (process.env.OSS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (process.env.URL) configured.push(new URL(process.env.URL).origin);
  return configured.includes(origin);
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ message: 'Method not allowed.' }, 405, { Allow: 'POST' });

  const origin = request.headers.get('origin');
  if (!requestOriginAllowed(origin)) return json({ message: 'Origin is not allowed.' }, 403);

  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const bucket = process.env.OSS_BUCKET || 'terminal-astro';
  const region = process.env.OSS_REGION || 'cn-shanghai';
  const endpoint = (process.env.OSS_ENDPOINT || 'oss-cn-shanghai.aliyuncs.com').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const configuredMaxMb = Number(process.env.OSS_MAX_FILE_SIZE_MB);
  const maxBytes = (Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : 5) * 1024 * 1024;

  if (!accessKeyId || !accessKeySecret) {
    return json({ message: 'OSS credentials are not configured.' }, 503);
  }

  const body = await request.json().catch(() => null);
  const contentType = typeof body?.contentType === 'string' ? body.contentType.toLowerCase() : '';
  const size = Number(body?.size);
  const extension = ALLOWED_IMAGE_TYPES.get(contentType);
  if (!extension) return json({ message: 'Only JPEG, PNG, WebP, and GIF images are allowed.' }, 400);
  if (!Number.isFinite(size) || size < 1 || size > maxBytes) {
    return json({ message: `Images must be smaller than ${maxBytes / 1024 / 1024} MB.` }, 400);
  }

  const now = new Date();
  const shortDate = now.toISOString().slice(0, 10).replaceAll('-', '');
  const ossDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const credential = `${accessKeyId}/${shortDate}/${region}/oss/aliyun_v4_request`;
  const key = `waline/${shortDate}/${randomUUID()}.${extension}`;
  const expiresAt = new Date(now.getTime() + 60_000).toISOString();
  const signatureVersion = 'OSS4-HMAC-SHA256';
  const successStatus = '200';

  const policyDocument = {
    expiration: expiresAt,
    conditions: [
      { bucket },
      { key },
      { 'x-oss-signature-version': signatureVersion },
      { 'x-oss-credential': credential },
      { 'x-oss-date': ossDate },
      { 'x-oss-content-type': contentType },
      { success_action_status: successStatus },
      ['content-length-range', 1, maxBytes],
    ],
  };
  const policy = Buffer.from(JSON.stringify(policyDocument), 'utf8').toString('base64');
  const dateKey = hmac(Buffer.from(`aliyun_v4${accessKeySecret}`, 'utf8'), shortDate);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, 'oss');
  const signingKey = hmac(serviceKey, 'aliyun_v4_request');
  const signature = createHmac('sha256', signingKey).update(policy, 'utf8').digest('hex');

  const host = `https://${bucket}.${endpoint}`;
  const publicBaseUrl = (process.env.OSS_PUBLIC_BASE_URL || host).replace(/\/$/, '');
  return json({
    host,
    publicUrl: `${publicBaseUrl}/${key}`,
    fields: {
      key,
      policy,
      'x-oss-signature-version': signatureVersion,
      'x-oss-credential': credential,
      'x-oss-date': ossDate,
      'x-oss-signature': signature,
      'x-oss-content-type': contentType,
      success_action_status: successStatus,
    },
  });
}

export const config = {
  path: '/.netlify/functions/oss-upload-policy',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['ip'],
    windowLimit: 10,
    windowSize: 60,
  },
};
