const UPSTREAM_ORIGIN = 'https://waline-blog-tau-three.vercel.app';
const PROXY_PREFIX = '/waline-api';

const REQUEST_HEADERS_TO_REMOVE = [
  'connection',
  'content-length',
  'host',
  'x-forwarded-host',
  'x-forwarded-proto',
];

const RESPONSE_HEADERS_TO_REMOVE = [
  'connection',
  'content-encoding',
  'content-length',
  'transfer-encoding',
];

function json(body, status) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export default async function handler(request) {
  const incomingUrl = new URL(request.url);
  const upstreamPath = incomingUrl.pathname.slice(PROXY_PREFIX.length);
  if (!upstreamPath.startsWith('/')) return json({ message: 'Invalid Waline proxy path.' }, 400);

  const upstreamUrl = new URL(upstreamPath, UPSTREAM_ORIGIN);
  upstreamUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  REQUEST_HEADERS_TO_REMOVE.forEach((name) => headers.delete(name));

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    RESPONSE_HEADERS_TO_REMOVE.forEach((name) => responseHeaders.delete(name));
    responseHeaders.set('Cache-Control', 'no-store');

    return new Response(await upstreamResponse.arrayBuffer(), {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[waline-proxy]', error);
    return json({ message: 'Unable to reach the Waline server.' }, 502);
  }
}

export const config = {
  path: '/waline-api/*',
};
