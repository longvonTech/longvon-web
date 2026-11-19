const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function client(fetch, env = {}, browser = true) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../../apps/web/lib/api-client.ts'), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  vm.runInNewContext(js, { exports, process: { env }, ...(browser ? { window: {} } : {}), Headers, fetch, Error });
  return exports;
}
test('browser with absent/blank API config uses same-origin /api', async () => {
  for (const value of [undefined, '', '   ']) {
    let captured;
    const { apiFetch } = client(async url => { captured = url; return new Response('{"submitted":true}'); }, { NEXT_PUBLIC_API_BASE_URL: value });
    await apiFetch('/partner-leads', { method: 'POST' }); assert.equal(captured, '/api/partner-leads');
  }
});
test('configured API removes trailing slash and preserves target', async () => {
  let captured; const { apiFetch } = client(async url => { captured = url; return new Response('{}'); }, { NEXT_PUBLIC_API_BASE_URL: ' http://127.0.0.1:4500/ ' });
  await apiFetch('/partner-leads'); assert.equal(captured, 'http://127.0.0.1:4500/partner-leads');
});
test('API error exposes status and known field only, not raw internal response', async () => {
  const { apiFetch, ApiError } = client(async () => new Response(JSON.stringify({ message: ['phone invalid SECRET'] }), { status: 400 }));
  await assert.rejects(apiFetch('/partner-leads'), error => error instanceof ApiError && error.status === 400 && error.fields[0] === 'phone' && !error.message.includes('SECRET'));
});
test('HTML gateway failure remains typed without exposing body', async () => {
  const { apiFetch, ApiError } = client(async () => new Response('<h1>SECRET</h1>', { status: 502 }));
  await assert.rejects(apiFetch('/partner-leads'), error => error instanceof ApiError && error.status === 502 && error.fields.length === 0 && !error.message.includes('SECRET'));
});
