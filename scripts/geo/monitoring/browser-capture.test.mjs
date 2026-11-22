import {test} from 'node:test';
import assert from 'node:assert/strict';
import {waitForGoogleAi} from './browser-capture.mjs';
test('AI final receipt required after generating state',async()=>{
 let n=0;const r=await waitForGoogleAi(async()=>++n===1?{generating:true}:{generating:false,complete:true});assert.equal(r.status,'COMPLETE');assert.equal(n,2);
});
test('bounded incomplete panel remains UNKNOWN',async()=>{
 const r=await waitForGoogleAi(async()=>({generating:true}),{maxReads:2});assert.equal(r.status,'UNKNOWN');
});
