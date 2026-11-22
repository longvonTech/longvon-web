// Adapter for the documented CUA Tab API. No direct browser transport or model API.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
export async function capture(tab, directory, id, { platform, requestedMode = 'DEFAULT_ANSWER', completion, sourceLinks = [], searchReceipt = false } = {}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid evidence ID');
  await mkdir(directory, { recursive: true });
  const dom = await tab.playwright.domSnapshot();
  const bounds = await tab.playwright.getByRole('textbox').first().evaluate(el => ({ viewport: el.ownerDocument.documentElement.clientWidth, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right }));
  const bytes = await tab.screenshot({ fullPage: true });
  const extension = bytes[0] === 255 && bytes[1] === 216 ? 'jpg' : 'png';
  const files = [[`${id}.txt`, dom], [`${id}.${extension}`, bytes]];
  const targets = sourceLinks.filter(x => {
    try { const u = new URL(x.url); return u.protocol === 'https:' && !u.username && !u.password && !['localhost','127.0.0.1','[::1]'].includes(u.hostname); } catch { return false; }
  });
  const meta = { captured_at: new Date().toISOString(), platform, mode: platform === 'ChatGPT' ? (requestedMode === 'REALTIME_SEARCH' ? (searchReceipt ? 'REALTIME_SEARCH' : 'SEARCH_UNVERIFIED') : 'DEFAULT_ANSWER') : requestedMode, completion: completion === true ? 'COMPLETE' : 'UNKNOWN', country: 'UNKNOWN', citation_targets: targets, citation_reachability: 'UNKNOWN', screenshot: bounds.left >= 0 && bounds.right <= bounds.viewport ? 'REQUIRES_VISUAL_REVIEW' : 'BLOCKED_LOCAL_ENV', bounds };
  for (const [name, content] of files) await writeFile(resolve(directory, name), content, { flag: 'wx' });
  meta.files = files.map(([name, content]) => ({ name, sha256: createHash('sha256').update(content).digest('hex') }));
  await writeFile(resolve(directory, `${id}.json`), JSON.stringify(meta, null, 2), { flag: 'wx' });
  return meta;
}
export async function waitForGoogleAi(readState, { timeoutMs = 30000, now = Date.now, maxReads = 30 } = {}) {
  const deadline = now() + timeoutMs;
  for (let i = 0; i < maxReads; i++) {
    const s = await readState();
    if (s.complete === true && s.generating === false) return { status: 'COMPLETE', state: s };
    if (now() >= deadline) break;
  }
  return { status: 'UNKNOWN', reason: 'TIMEOUT_OR_READ_LIMIT' };
}
export function googleAiSnapshotState(snapshot) {
  const panel = /heading [^\n]*AI Overview/.test(snapshot);
  const generating = /progressbar[^\n]*Generating|heading [^\n]*(Thinking|Searching)/.test(snapshot);
  const receipt = /Show more AI Overview|AI responses may include mistakes/.test(snapshot);
  return { panel, generating, complete: panel && receipt && !generating };
}
export async function collectVisibleCitationTargets(tab, providerHosts = []) {
  const links = await tab.playwright.getByRole('link').evaluateAll(as => as.map(a => ({label:a.innerText,url:a.href})));
  const targets=[];
  for (const x of links) {
    try { const u=new URL(x.url); if(u.protocol==='https:' && !u.username && !u.password && !providerHosts.includes(u.hostname) && !targets.some(t=>t.url===x.url)) targets.push(x); } catch {}
  }
  return { targets, completeness:'UNKNOWN', reachability:'UNKNOWN', method:'visible DOM links only; domain labels are never expanded into guessed URLs' };
}
