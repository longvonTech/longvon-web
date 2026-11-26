// Real isolated PM2 process adapter; no production paths, keys, credentials or DB.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),http=require('node:http'),net=require('node:net'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=fs.mkdtempSync('/tmp/lv-dual-pm2-'),control=path.join(root,'_recovery'),out=process.env.LV_REHEARSAL_OUTPUT||path.join(root,'evidence.json');
const original='actions-1-1',next='actions-2-1',rollback='actions-3-1';
const env={...process.env,PM2_HOME:path.join(root,'pm2-home'),LV_ISOLATED_ROOT:root};
function pm2(args){const r=cp.spawnSync('pm2',args,{env,encoding:'utf8',timeout:30000});assert.equal(r.status,0,r.stderr);return r.stdout}
async function port(){return new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})})}
function write(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data)}
function hash(b){return crypto.createHash('sha256').update(b).digest('hex')}
function make(id,build){const ar=path.join(control,'releases',id,'web');const code=`const h=require('http'),fs=require('fs'),p=require('path');const build=fs.readFileSync(p.join(__dirname,'.next/BUILD_ID'),'utf8').trim();h.createServer((q,r)=>{if(q.url.startsWith('/_next/static/')){r.end('STATIC')}else {r.setHeader('content-type','text/html');r.end('<html>'+build+'</html>')}}).listen(Number(process.env.PORT),'127.0.0.1');`;
 const files={'apps/web/server.js':code,'apps/web/.next/BUILD_ID':build,'apps/web/.next/static/safe.js':'STATIC'};for(const [n,v]of Object.entries(files))write(path.join(ar,n),v);
 write(path.join(ar,'web-manifest.json'),JSON.stringify({files:Object.fromEntries(Object.entries(files).map(([n,v])=>[n,hash(v)])),staticFiles:{'safe.js':hash('STATIC')}}));return path.join(ar,'apps/web/server.js')}
function inspect(){const a=JSON.parse(pm2(['jlist']));return {web:a.find(x=>x.name==='mateyou-web'),api:a.find(x=>x.name==='mateyou-api')}}
(async()=>{const webPort=await port(),prePort=await port();env.LV_TEST_WEB_BASE=env.LV_TEST_PROXY_BASE='http://127.0.0.1:'+webPort;env.LV_TEST_PREFLIGHT_PORT=String(prePort);
 const apiFile=path.join(root,'synthetic-api.cjs');write(apiFile,`require('http').createServer((q,r)=>{r.setHeader('content-type','application/json');r.end('{"status":"ok"}')}).listen(0,'127.0.0.1',function(){require('fs').writeFileSync(${JSON.stringify(path.join(root,'api-port'))},String(this.address().port))})`);
 pm2(['start',apiFile,'--name','mateyou-api']);for(let i=0;i<100&&!fs.existsSync(path.join(root,'api-port'));i++)await new Promise(r=>setTimeout(r,50));env.LV_TEST_API_BASE='http://127.0.0.1:'+fs.readFileSync(path.join(root,'api-port'),'utf8');
 const first=make(original,'baseline');write(path.join(root,'public-static/safe.js'),'STATIC');
 const config=path.join(root,'initial.json');write(config,JSON.stringify({apps:[{name:'mateyou-web',script:first,cwd:root,env:{PORT:String(webPort)},exec_mode:'fork'}]}));pm2(['start',config]);const before=inspect();
 const record={id:original,webScript:first,apiScript:before.api.pm2_env.pm_exec_path,healthyRfqBaseline:true,routeCount:72,phase:'geo',commit:'a'.repeat(40)};write(path.join(control,'active.json'),JSON.stringify(record));write(path.join(control,'releases',original,'record.json'),JSON.stringify(record));
 const events=[];const state=()=>JSON.parse(fs.readFileSync(path.join(control,'active.json')));
 async function run(operation,id,build,interrupt,recover=false){const stage=path.join(control,'incoming/cloud-42-1');fs.mkdirSync(stage,{recursive:true});if(operation==='release'&&!recover){const script=make(id,build);fs.renameSync(path.join(control,'releases',id,'web'),path.join(stage,'web'));fs.rmdirSync(path.join(control,'releases',id))}
 const expected=state().id===original?'baseline':state().id===next?'candidate':'candidate-2';
 // Interrupted-operation recovery must approve the original baseline build, not the potentially advanced active record.
 const approvalBuild=recover?'baseline':expected;
 const args=[path.resolve(__dirname,'web-switch.cjs'),operation,id,'CHANGE-001','CHANGE-001','true',approvalBuild,JSON.stringify([original,next,rollback]),'42','1',operation==='rollback'?id:'',JSON.stringify({commit:'b'.repeat(40),routeCount:72,buildId:build}),'--isolated',...(recover?['--recover-interrupted']:[])];
 const child=cp.spawn(process.execPath,args,{env:{...env,...(interrupt==='health-fail'?{LV_TEST_POST_SWITCH_FAIL:'1'}:interrupt?{LV_TEST_INTERRUPT:interrupt}:{})},stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);const result=await new Promise(resolve=>child.on('close',(code,signal)=>resolve({code,signal,log})));
 assert.equal(inspect().api.pid,before.api.pid,'API must never restart');return result;}
 let r=await run('release',next,'candidate');assert.equal(r.code,0,r.log);assert.equal(state().id,next);events.push('real PM2 release PASS');
 r=await run('rollback',original,'baseline');assert.equal(r.code,0,r.log);assert.equal(state().id,original);events.push('independent healthy rollback PASS');
 r=await run('release','actions-7-1','bad-health','health-fail');assert.notEqual(r.code,0);assert.equal(state().id,original);assert.equal(inspect().web.pm2_env.pm_exec_path,first);events.push('post-switch health failure auto-rollback PASS');
 r=await run('release','actions-8-1','bad-record','record-fail');assert.notEqual(r.code,0);assert.equal(state().id,original);assert.equal(inspect().web.pm2_env.pm_exec_path,first);events.push('active-record write failure reconciliation PASS');
 // Use a new destination for each interrupted transaction; retained records are immutable.
 for(const [id,point]of [['actions-4-1','after-switch'],['actions-5-1','after-record']]){
  r=await run('release',id,'interrupted',point);assert.equal(r.signal,'SIGKILL',r.log);assert.ok(fs.existsSync(path.join(control,'deployment.lock')));
  r=await run('release',id,'interrupted',null,true);assert.equal(r.code,0,r.log);assert.equal(state().id,original);assert.equal(inspect().web.pm2_env.pm_exec_path,first);assert.ok(!fs.existsSync(path.join(control,'deployment.lock')));events.push(point+' dead-owner reconciliation PASS');
 }
 const lock=path.join(control,'deployment.lock');fs.mkdirSync(lock);write(path.join(lock,'owner.json'),JSON.stringify({pid:process.pid,host:os.hostname()}));r=await run('release','actions-6-1','candidate',null,true);assert.notEqual(r.code,0);assert.ok(r.log.includes('still running'));fs.rmSync(lock,{recursive:true});events.push('live-owner lock rejection PASS');
 const report={result:'PASS',platform:process.platform,arch:process.arch,apiPidUnchanged:true,realProcessAdapter:true,productionConnections:0,events};delete report.pm2Version;write(out,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{try{pm2(['kill'])}catch{}});
