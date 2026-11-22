import {test} from 'node:test';
import assert from 'node:assert/strict';
import {waitForGoogleAi} from './browser-capture.mjs';
test('AI final receipt required after generating state',async()=>{
 let n=0;const r=await waitForGoogleAi(async()=>++n===1?{generating:true}:{generating:false,complete:true});assert.equal(r.status,'COMPLETE');assert.equal(n,2);
});
test('bounded incomplete panel remains UNKNOWN',async()=>{
 const r=await waitForGoogleAi(async()=>({generating:true}),{maxReads:2});assert.equal(r.status,'UNKNOWN');
});
import {googleAiSnapshotState} from './browser-capture.mjs';
test('real first-round captured pending Google panel remains incomplete',async()=>{
 const {readFile}=await import('node:fs/promises');const raw=JSON.parse(await readFile(new URL('../../../docs/geo/geo-43-003/evidence/2026-11-22-round1/google-Q07.json',import.meta.url),'utf8'));
 assert.equal(googleAiSnapshotState(raw.snapshot).complete,false);
});
test('real first-round final Google panel exposes completion receipt',async()=>{
 const {readFile}=await import('node:fs/promises');const raw=JSON.parse(await readFile(new URL('../../../docs/geo/geo-43-003/evidence/2026-11-22-round1/google-Q01.json',import.meta.url),'utf8'));
 assert.equal(googleAiSnapshotState(raw.snapshot).complete,true);
});
