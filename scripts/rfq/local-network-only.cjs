// Preload for the isolated standalone test server only; never ship as runtime code.
const http=require('node:http'),https=require('node:https');
function allowed(host){return ['127.0.0.1','localhost','::1','[::1]'].includes(host)}
const fetch=global.fetch;global.fetch=(input,init)=>{const u=new URL(typeof input==='string'||input instanceof URL?input:input.url);if(!allowed(u.hostname))return Promise.reject(new Error('RFQ_TEST_EXTERNAL_NETWORK_BLOCKED'));return fetch(input,init)};
for(const protocol of [http,https])for(const method of ['request','get']){const original=protocol[method];protocol[method]=function(input,...args){let host;if(typeof input==='string'||input instanceof URL)host=new URL(input).hostname;else host=(input.hostname||input.host||'localhost').split(':')[0];if(!allowed(host))throw new Error('RFQ_TEST_EXTERNAL_NETWORK_BLOCKED');return original.call(this,input,...args)}}
