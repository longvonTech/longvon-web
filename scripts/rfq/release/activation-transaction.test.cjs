const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {createActivator,probe}=require('./activation-transaction.cjs');
async function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'rfq-activation-')),artifact=path.join(root,'artifact');
 for(const d of ['logs','tmp/client','tmp/proxy','static','bin','artifact','configs'])fs.mkdirSync(path.join(root,d),{recursive:true});
 fs.writeFileSync(path.join(artifact,'web-manifest.json'),JSON.stringify({files:{},staticFiles:{}}));
 const active=path.join(root,'active.conf'),live=path.join(root,'live'),stateFile=path.join(root,'state.json');
 fs.symlinkSync(path.join(root,'configs/fallback.conf'),active);fs.writeFileSync(live,'fallback');fs.writeFileSync(stateFile,JSON.stringify({reloads:0}));
 for(const name of ['fallback','candidate'])fs.writeFileSync(path.join(root,'configs',name+'.conf'),name);
 const methods=[],state={candidateDown:false,fallbackDown:false,wrongModel:false};
 const server=http.createServer((req,res)=>{methods.push(req.method);const proxy=req.url.startsWith('/proxy'),name=proxy?fs.readFileSync(live,'utf8'):req.url.split('/')[1];
  if(state[name+'Down']){res.statusCode=503;return res.end('Unavailable')}
  res.setHeader('X-RFQ-Release',name);res.setHeader('X-RFQ-API',name);
  if(req.url.includes('/admin/leads')){if(req.headers.authorization!=='Bearer TEST'){res.statusCode=401;return res.end()};return res.end(JSON.stringify({total:1,items:[state.wrongModel?{}:{referrer:null,landingPage:null,attribution:null,commercialStage:'NEW_INQUIRY',commercialGrade:null,commercialMeta:null}]}))}
  res.end('ok');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const binary=`#!${process.execPath}\nconst fs=require('fs'),path=require('path');const f=${JSON.stringify(stateFile)},s=JSON.parse(fs.readFileSync(f));if(process.argv.includes('-t'))process.exit(0);s.reloads++;fs.writeFileSync(f,JSON.stringify(s));if(s.failAll||s.failFirst&&s.reloads===1)process.exit(1);fs.writeFileSync(${JSON.stringify(live)},path.basename(fs.readlinkSync(${JSON.stringify(active)}),'.conf'));`;
 fs.writeFileSync(path.join(root,'bin/nginx'),binary,{mode:0o755});const oldPath=process.env.PATH;process.env.PATH=path.join(root,'bin')+path.delimiter+oldPath;
 const release=name=>({name,apiName:name,artifact,config:path.join(root,'configs',name+'.conf'),web:base+'/'+name,api:base+'/'+name});
 const previous=release('fallback'),target=release('candidate');
 return {root,state,methods,active,stateFile,previous,target,activate(onEvent){return createActivator({root,staticRoot:path.join(root,'static'),nginxMain:'unused',proxy:base+'/proxy',token:'TEST',timeoutMs:1000,requestTimeoutMs:2000,onEvent})({target,previous})},async clean(){process.env.PATH=oldPath;server.closeAllConnections();await new Promise(r=>server.close(r));fs.rmSync(root,{recursive:true,force:true})}};
}
test('API unavailable aborts before reload or pointer change',async()=>{const f=await fixture();try{f.state.candidateDown=true;await assert.rejects(f.activate(),e=>e.code==='PREFLIGHT_ABORT');assert.equal(fs.readlinkSync(f.active),f.previous.config);assert.equal(JSON.parse(fs.readFileSync(f.stateFile)).reloads,0);assert.ok(f.methods.every(m=>m==='GET'))}finally{await f.clean()}});
test('post-switch API failure restores pointer, reloads and verifies previous API',async()=>{const f=await fixture();try{await assert.rejects(f.activate(e=>{if(e.phase==='reload-acknowledged')f.state.candidateDown=true}),e=>e.code==='RECOVERED');assert.equal(fs.readlinkSync(f.active),f.previous.config);assert.equal(JSON.parse(fs.readFileSync(f.stateFile)).reloads,2)}finally{await f.clean()}});
test('unhealthy recovery is reported as RECOVERY_FAILED, never success',async()=>{const f=await fixture();try{await assert.rejects(f.activate(e=>{if(e.phase==='reload-acknowledged'){f.state.candidateDown=true;f.state.fallbackDown=true}}),e=>e.code==='RECOVERY_FAILED')}finally{await f.clean()}});
test('reload command failure still reloads old configuration and verifies it',async()=>{const f=await fixture();try{fs.writeFileSync(f.stateFile,JSON.stringify({reloads:0,failFirst:true}));await assert.rejects(f.activate(),e=>e.code==='RECOVERED');assert.equal(JSON.parse(fs.readFileSync(f.stateFile)).reloads,2);assert.equal(fs.readlinkSync(f.active),f.previous.config)}finally{await f.clean()}});
test('valid API, assets and both locales permit commit using GET only',async()=>{const f=await fixture();try{assert.equal((await f.activate()).result,'COMMITTED');assert.equal(fs.readlinkSync(f.active),f.target.config);assert.ok(f.methods.every(m=>m==='GET'))}finally{await f.clean()}});
test('concurrent activation is rejected without touching the first lock',async()=>{const f=await fixture();try{fs.mkdirSync(path.join(f.root,'activation.lock'));await assert.rejects(f.activate(),e=>e.code==='EEXIST');assert.ok(fs.existsSync(path.join(f.root,'activation.lock')));assert.equal(fs.readlinkSync(f.active),f.previous.config)}finally{await f.clean()}});
test('missing aligned fields reject readiness despite HTTP 200',async()=>{const f=await fixture();try{f.state.wrongModel=true;await assert.rejects(f.activate(),e=>e.code==='PREFLIGHT_ABORT');assert.equal(JSON.parse(fs.readFileSync(f.stateFile)).reloads,0)}finally{await f.clean()}});
