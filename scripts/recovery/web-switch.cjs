// The host adapter is limited to mateyou-web. No API commands or database client.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {createHash} = require('node:crypto');
const {assertReady, publish} = require('../rfq/release/static-transaction.cjs');
const {poll} = require('../rfq/release/activation-transaction.cjs');

const releaseId = /^(?:[0-9]{17}-[a-f0-9]{12}|actions-[1-9][0-9]*-[1-9][0-9]*)$/;
const buildId = /^[A-Za-z0-9_-]+$/;

function authorize({enabled, approval, approvedApproval, expectedBuild, healthy, target, operation, approvedTarget}) {
  assert.equal(enabled, 'true', 'Production handoff is blocked');
  assert.match(approval, /^[A-Z][A-Z0-9-]{7,63}$/);
  assert.equal(approval, approvedApproval, 'Approval does not match reviewed operation');
  assert.match(expectedBuild, buildId);
  assert.ok(Array.isArray(healthy) && healthy.length > 0 && healthy.every(id => releaseId.test(id)));
  assert.ok(['release', 'rollback'].includes(operation));
  assert.match(target, releaseId);
  if (operation === 'rollback') {
    assert.equal(target, approvedTarget, 'Rollback target differs from approval');
    assert.ok(healthy.includes(target), 'Target is not an accepted healthy release');
  }
}

async function activate({previous, target, inspect, prepare, check, switchWeb, save, record, event, restoreRecord = () => {}, verifyPrevious = true}) {
  const before = inspect();
  assert.equal(before.webScript, previous.webScript, 'Active Web differs from recorded Web');
  assert.equal(before.apiScript, previous.apiScript, 'Active API differs from recorded API');
  const assertApi = () => {
    const after = inspect();
    assert.equal(after.apiPid, before.apiPid, 'API PID changed');
    assert.equal(after.apiScript, before.apiScript, 'API script changed');
    assert.equal(after.apiUptime,before.apiUptime,'API start time changed');
    assert.equal(after.apiRestarts,before.apiRestarts,'API restart count changed');
  };
  if (verifyPrevious) await check(previous);
  await prepare(target);
  assertApi();
  event('switch-started');
  try {
    switchWeb(target.webScript);
    await check(target);
    assertApi();
    save();
    record(target);
  } catch (error) {
    try {
      switchWeb(previous.webScript);
      await check(previous);
      assertApi();
      restoreRecord(previous);
      save();
    } catch {
      event('recovery-failed');
      throw new Error('Web recovery failed; operator intervention required');
    }
    event('recovered');
    throw error;
  }
  event('committed');
}

async function host([operation, target, approval, approvedApproval, enabled, expectedBuild, healthyJson, run, attempt, approvedTarget, candidateJson]) {
  const healthy = JSON.parse(healthyJson);
  authorize({operation, target, approval, approvedApproval, enabled, expectedBuild, healthy, approvedTarget});
  assert.match(run, /^[1-9][0-9]*$/);
  assert.match(attempt, /^[1-9][0-9]*$/);
  const isolated = process.argv.includes('--isolated');
  const isolatedRoot = process.env.LV_ISOLATED_ROOT;
  if (isolated) assert.ok(isolatedRoot && path.resolve(isolatedRoot).startsWith('/tmp/lv-dual-'), 'Isolated root must be a dedicated /tmp/lv-dual-* directory');
  else assert.ok(!isolatedRoot, 'Root override forbidden in production');
  const root = isolated ? path.resolve(isolatedRoot) : '/root/mateyou';
  const candidatePolicy = operation === 'release' ? JSON.parse(candidateJson) : null;
  if (candidatePolicy) {
    assert.match(candidatePolicy.commit, /^[a-f0-9]{40}$/);
    assert.ok([68,72].includes(candidatePolicy.routeCount));
    assert.match(candidatePolicy.buildId, buildId);
  }
  const webBase = isolated ? process.env.LV_TEST_WEB_BASE : 'http://127.0.0.1:3000';
  const proxyBase = isolated ? process.env.LV_TEST_PROXY_BASE : 'https://www.longvon.com';
  const apiBase = isolated ? process.env.LV_TEST_API_BASE : 'http://127.0.0.1:4000';
  const preflightPort = isolated ? process.env.LV_TEST_PREFLIGHT_PORT : '3101';
  if (isolated) for (const base of [webBase,proxyBase,apiBase]) assert.equal(new URL(base).hostname,'127.0.0.1');
  const control = path.join(root, '_recovery');
  const releases = path.join(control, 'releases');
  const staticRoot = isolated ? path.join(root, 'public-static') : '/var/www/mateyou/static';
  const activeFile = path.join(control, 'active.json');
  const lock = path.join(control, 'deployment.lock');
  const stage = path.join(control, 'incoming', `cloud-${run}-${attempt}`);
  const audit = path.join(stage, 'host-audit.jsonl');
  const event = status => {
    const line = JSON.stringify({operation, target, approval, run, attempt, status, at: new Date().toISOString()});
    fs.appendFileSync(audit, line + '\n', {mode: 0o600});
    console.log(line);
  };
  const read = file => JSON.parse(fs.readFileSync(file));
  const pm2 = args => {
    const result = spawnSync('pm2', args, {encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024});
    assert.equal(result.status, 0, 'PM2 operation failed: ' + args[0]);
    return result.stdout;
  };
  const processes = (allowMissing = false) => {
    const rows = JSON.parse(pm2(['jlist']));
    const web = rows.filter(row => row.name === 'mateyou-web');
    const api = rows.filter(row => row.name === 'mateyou-api');
    assert.ok(web.length === 1 || allowMissing && web.length === 0,'Expected one Web process');
    assert.equal(api.length, 1);
    assert.ok(api[0].pid > 0 && api[0].pm2_env.status === 'online', 'API baseline unavailable');
    return {web: web[0]?.pm2_env, apiPid: api[0].pid, apiScript: api[0].pm2_env.pm_exec_path,
      apiUptime:api[0].pm2_env.pm_uptime,apiRestarts:api[0].pm2_env.restart_time,webScript: web[0]?.pm2_env.pm_exec_path || null};
  };
  const artifact = id => path.join(releases, id, 'web');
  const script = id => path.join(artifact(id), 'apps/web/server.js');
  const getBuild = id => {
    const idText = fs.readFileSync(path.join(artifact(id), 'apps/web/.next/BUILD_ID'), 'utf8').trim();
    assert.match(idText, buildId);
    return idText;
  };
  const checkPages = async (release, base) => {
    const build = getBuild(release.id);
    const pages = ['/partner/oem', '/en/partner/oem'];
    if (release.routeCount === 72) pages.push('/smart-ring-sdk-api', '/en/smart-ring-sdk-api',
      '/osa-smart-ring-technology', '/en/osa-smart-ring-technology');
    for (const page of pages) {
      const response = await fetch(base + page, {redirect: 'error', signal: AbortSignal.timeout(4000),
        headers: {'Cache-Control': 'no-cache'}});
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(build), 'Unexpected Web BUILD_ID');
    }
  };
  const check = release => poll(async () => {
    if(isolated && process.env.LV_TEST_POST_SWITCH_FAIL==='1' && release.id===target && fs.existsSync(journalFile) && read(journalFile).phase==='process-switched') throw new Error('ISOLATED_POST_SWITCH_HEALTH_FAILURE');
    await checkPages(release, webBase);
    await checkPages(release, proxyBase);
    const api = await fetch(apiBase+'/health/ready',
      {redirect: 'error', signal: AbortSignal.timeout(4000)});
    assert.equal(api.status, 200, 'API liveness failed');
    assert.equal((await api.json()).status, 'ok', 'Unexpected API liveness response');
    const manifest = read(path.join(artifact(release.id), 'web-manifest.json'));
    for (const [name, checksum] of Object.entries(manifest.staticFiles)) {
      const response = await fetch(proxyBase+'/_next/static/' + name,
        {redirect: 'error', signal: AbortSignal.timeout(4000)});
      assert.equal(response.status, 200);
      assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'), checksum);
    }
  }, {timeoutMs: isolated?2000:60000});
  const recover = process.argv.includes('--recover-interrupted');
  const journalFile = path.join(control,'web-transaction.json');
  const atomic = (file,value) => { const tmp=file+'.next'; fs.writeFileSync(tmp,JSON.stringify(value),{mode:0o600}); fs.renameSync(tmp,file); };
  if (recover) {
    assert.ok(fs.existsSync(lock),'No interrupted lock');
    const owner=read(path.join(lock,'owner.json'));
    assert.equal(owner.host,require('node:os').hostname(),'Lock belongs to another host');
    let alive=true;try{process.kill(owner.pid,0)}catch(e){if(e.code==='ESRCH')alive=false;else throw e}
    assert.equal(alive,false,'Lock owner still running');
    const j=read(journalFile);
    assert.equal(j.ownerPid,owner.pid);assert.equal(j.expectedBuild,expectedBuild);
    assert.equal(j.previous.healthyRfqBaseline,true);assert.ok(healthy.includes(j.previous.id));
    assert.equal(j.previous.webScript,script(j.previous.id));
    assert.equal(getBuild(j.previous.id),expectedBuild);
    const actual=processes(true);assert.equal(actual.apiPid,j.apiPid);assert.equal(actual.apiScript,j.previous.apiScript);
    assert.ok([null,j.previous.webScript,script(j.target)].includes(actual.webScript),'Unrecognized active process');
    const recorded=read(activeFile);assert.ok([j.previous.id,j.target].includes(recorded.id),'Unrecognized active record');
    assertReady({artifact:artifact(j.previous.id),staticRoot});
    // Serialize recovery contenders. Existing unknown/legacy locks are never silently removed.
    const recovering=path.join(lock,'recovering');fs.mkdirSync(recovering,{mode:0o700});
    try {
      if (actual.webScript!==j.previous.webScript || actual.web?.status!=='online') replaceWeb(j.snapshot,j.previous.webScript);
      await check(j.previous);
      assert.equal(processes().apiPid,j.apiPid);
      pm2(['save']);atomic(activeFile,j.previous);
      atomic(journalFile,{...j,phase:'reconciled',finished:new Date().toISOString()});event('interruption-reconciled');
    } catch(error) { event('recovery-failed');throw error; }
    finally { fs.rmdirSync(recovering); }
    fs.unlinkSync(path.join(lock,'owner.json'));fs.rmdirSync(lock);return;
  }
  fs.mkdirSync(lock, {mode: 0o700});
  fs.writeFileSync(path.join(lock,'owner.json'),JSON.stringify({pid:process.pid,host:require('node:os').hostname()}),{mode:0o600,flag:'wx'});
  let journal;
  function replaceWeb(snapshot, webScript) {
    const config=path.join(stage,'pm2-private.json');
    fs.writeFileSync(config,JSON.stringify({apps:[{name:'mateyou-web',script:webScript,cwd:root,
      env:snapshot.env,exec_mode:'fork',instances:1,interpreter:snapshot.exec_interpreter,
      node_args:snapshot.node_args,kill_timeout:snapshot.kill_timeout,
      max_memory_restart:snapshot.max_memory_restart,out_file:snapshot.pm_out_log_path,
      error_file:snapshot.pm_err_log_path,autorestart:snapshot.autorestart}]}),{mode:0o600});
    try {if(JSON.parse(pm2(['jlist'])).some(row=>row.name==='mateyou-web'))pm2(['delete','mateyou-web']);pm2(['start',config,'--only','mateyou-web']);}
    finally {fs.rmSync(config,{force:true});}
  }
  try {
    event('started');
    const previous = read(activeFile);
    assert.match(previous.id, releaseId);
    assert.notEqual(previous.id, target);
    assert.equal(previous.healthyRfqBaseline, true);
    assert.equal(previous.webScript, script(previous.id));
    assert.equal(getBuild(previous.id), expectedBuild, 'Active build differs from approval');
    event('active-build-verified');
    assertReady({artifact: artifact(previous.id), staticRoot});
    const snapshot = processes().web;
    assert.equal(snapshot.exec_mode, 'fork_mode');
    assert.equal(snapshot.pm_cwd, root);
    journal={ownerPid:process.pid,previous,expectedBuild,target,apiPid:processes().apiPid,snapshot,phase:'prepared'};
    atomic(journalFile,journal);
    const journalEvent=status=>{journal.phase=status;atomic(journalFile,journal);event(status);};
    let next;
    await activate({
      previous, target: {webScript: script(target)}, inspect: processes, event:journalEvent, restoreRecord:()=>atomic(activeFile,previous), save: () => pm2(['save']),
      verifyPrevious: operation === 'release',
      prepare: async () => {
        if (operation === 'release') {
          assert.ok(healthy.includes(previous.id), 'Current version is not an accepted rollback baseline');
          fs.mkdirSync(path.dirname(artifact(target)), {mode: 0o700});
          fs.renameSync(path.join(stage, 'web'), artifact(target));
          publish({artifact: artifact(target), staticRoot});
          next = {...previous, id: target, webScript: script(target), phase: 'geo',
            commit: candidatePolicy.commit, routeCount: candidatePolicy.routeCount};
        } else {
          const stored = read(path.join(releases, target, 'record.json'));
          assert.equal(stored.id, target);
          assert.equal(stored.webScript, script(target));
          next = {...previous, id: target, webScript: stored.webScript, commit: stored.commit,
            phase: stored.phase, routeCount: stored.routeCount, rollbackFrom: previous.id};
        }
        assertReady({artifact: artifact(target), staticRoot});
        if(candidatePolicy) assert.equal(getBuild(target),candidatePolicy.buildId,'Candidate build differs from policy');
        const preflight = spawn(process.execPath, [next.webScript], {cwd: root,
          env: {...snapshot.env, PORT: preflightPort, HOSTNAME: '127.0.0.1'}, stdio: 'ignore'});
        let startError;
        preflight.once('error', error => { startError = error; });
        try {
          await poll(async () => {
            assert.ok(!startError && preflight.exitCode === null && preflight.signalCode === null,
              'Preflight Web did not stay running');
            await checkPages(next, 'http://127.0.0.1:'+preflightPort);
          });
        } finally {
          if (preflight.pid && preflight.exitCode === null && preflight.signalCode === null) {
            const stopped = new Promise(resolve => preflight.once('exit', resolve));
            preflight.kill('SIGKILL');
            await stopped;
          }
        }
        event('preflight-passed');
      },
      check: release => check(release === previous ? previous : next),
      switchWeb: webScript => {
        replaceWeb(snapshot,webScript);
        journal.phase='process-switched';atomic(journalFile,journal);
        if(isolated && process.env.LV_TEST_INTERRUPT==='after-switch')process.kill(process.pid,'SIGKILL');
      },
      record: () => {
        if (operation === 'release') fs.writeFileSync(path.join(releases, target, 'record.json'),
          JSON.stringify(next), {mode: 0o600, flag: 'wx'});
        const pending = path.join(stage, 'active.json');
        fs.writeFileSync(pending, JSON.stringify(next), {mode: 0o600, flag: 'wx'});
        fs.renameSync(pending, activeFile);
        journal.phase='record-written';atomic(journalFile,journal);
        if(isolated && process.env.LV_TEST_INTERRUPT==='after-record')process.kill(process.pid,'SIGKILL');
      }
    });
  } catch (error) {
    event('failed');
    throw error;
  } finally {
    // Keep recovery-failed lock/journal for explicit reconciliation; never blindly unlock.
    if(!journal || journal.phase!=='recovery-failed'){fs.unlinkSync(path.join(lock,'owner.json'));fs.rmdirSync(lock);}
  }
}

module.exports = {authorize, activate};
if (require.main === module) host(process.argv.slice(2)).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
