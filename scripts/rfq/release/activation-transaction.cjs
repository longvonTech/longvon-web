// Local operations only. No SSH, PM2, POST, database writes, or migrations.
// Caller supplies immutable releases and authenticated read-only CRM access.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const {assertReady} = require('./static-transaction.cjs');
async function poll(check, {timeoutMs=20000, intervalMs=200}={}) {
  const end=Date.now()+timeoutMs;
  do { try { await check(); return; } catch {} if(Date.now()>=end) break;
    await new Promise(r=>setTimeout(r,intervalMs));
  } while(Date.now()<end);
  throw new Error('Release readiness deadline exceeded');
}
async function get(url, token, timeoutMs) {
  return fetch(url,{method:'GET',redirect:'error',signal:AbortSignal.timeout(timeoutMs),
    headers:{Connection:'close',...(token?{Authorization:'Bearer '+token}:{})}});
}
async function probe({web,api,release,apiRelease,token,requestTimeoutMs=2000}) {
  assert.ok(token,'Authenticated read-only API gate requires a token');
  for(const page of ['/en/partner/oem','/partner/oem']) {
    const r=await get(web+page,null,requestTimeoutMs);
    assert.equal(r.status,200,'Web readiness');
    if(release) assert.equal(r.headers.get('x-rfq-release'),release,'Wrong Web release');
    await r.arrayBuffer();
  }
  // Existing production route -> JWT -> role lookup -> repository -> Prisma/DB.
  // commercialStage forces the aligned Prisma model even if the list is empty.
  const r=await get(api+'/admin/leads?commercialStage=NEW_INQUIRY&page=1&pageSize=1',token,requestTimeoutMs);
  assert.equal(r.status,200,'API/DB readiness');
  if(apiRelease) assert.equal(r.headers.get('x-rfq-api'),apiRelease,'Wrong API release');
  const body=await r.json();assert.ok(Array.isArray(body.items));assert.ok(Number.isInteger(body.total)&&body.total>=0);
  for(const item of body.items) for(const key of ['referrer','landingPage','attribution','commercialStage','commercialGrade','commercialMeta'])
    assert.ok(Object.hasOwn(item,key),'Aligned field missing: '+key);
}
function replaceLink(active, target) {
  const tmp=active+'.next';fs.rmSync(tmp,{force:true});fs.symlinkSync(target,tmp);fs.renameSync(tmp,active);
}
function createActivator({root,staticRoot,nginxMain,proxy,token,timeoutMs=20000,requestTimeoutMs=2000,onEvent=()=>{}}) {
  const active=path.join(root,'active.conf'),lock=path.join(root,'activation.lock');
  function validate(file) {
    const conf=path.join(root,'validate.conf');
    fs.writeFileSync(conf,`pid ${root}/validate.pid; error_log ${root}/logs/validate-error.log; events {} http { access_log off; client_body_temp_path ${root}/tmp/client; proxy_temp_path ${root}/tmp/proxy; include /etc/nginx/mime.types; include ${file}; }`);
    const r=spawnSync('nginx',['-t','-p',root+'/', '-c',conf],{encoding:'utf8',timeout:10000});
    assert.equal(r.status,0,'Nginx configuration rejected');
  }
  function reload() {
    const r=spawnSync('nginx',['-p',root+'/', '-c',nginxMain,'-s','reload'],{encoding:'utf8',timeout:10000});
    assert.equal(r.status,0,'Nginx reload not acknowledged');
  }
  const direct=r=>probe({web:r.web,api:r.api,token,requestTimeoutMs});
  const proxied=r=>probe({web:proxy,api:proxy+'/api',release:r.name,apiRelease:r.apiName,token,requestTimeoutMs});
  return async function activate({target,previous}) {
    // A second operator must never mutate the shared pointer during this transaction.
    fs.mkdirSync(lock);let switched=false;
    let old;
    try {
      old=fs.readlinkSync(active);
      assert.equal(path.resolve(root,old),path.resolve(previous.config),'Previous release mismatch');
      assertReady({artifact:previous.artifact,staticRoot});validate(previous.config);
      await poll(()=>direct(previous),{timeoutMs});await poll(()=>proxied(previous),{timeoutMs});
      assertReady({artifact:target.artifact,staticRoot});validate(target.config);
      await poll(()=>direct(target),{timeoutMs});
      await onEvent({phase:'preflight-pass',release:target.name});
      replaceLink(active,target.config);switched=true;reload();
      await onEvent({phase:'reload-acknowledged',release:target.name});
      await poll(()=>proxied(target),{timeoutMs});
      await onEvent({phase:'committed',release:target.name});
      return {result:'COMMITTED',release:target.name};
    } catch(error) {
      if(!switched) throw Object.assign(new Error('Activation aborted before switch'),{code:'PREFLIGHT_ABORT',cause:error});
      try {
        replaceLink(active,old);validate(previous.config);reload();
        await poll(()=>proxied(previous),{timeoutMs});
      } catch(recovery) {
        await onEvent({phase:'recovery-failed',release:previous.name});
        throw Object.assign(new Error('Automatic recovery failed; operator intervention required'),{code:'RECOVERY_FAILED',cause:recovery});
      }
      await onEvent({phase:'recovered',release:previous.name});
      throw Object.assign(new Error('Activation failed; previous healthy release restored'),{code:'RECOVERED',cause:error});
    } finally { fs.rmdirSync(lock); }
  };
}
module.exports={poll,probe,replaceLink,createActivator};
