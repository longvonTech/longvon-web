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

async function activate({previous, target, inspect, prepare, check, switchWeb, save, record, event, verifyPrevious = true}) {
  const before = inspect();
  assert.equal(before.webScript, previous.webScript, 'Active Web differs from recorded Web');
  assert.equal(before.apiScript, previous.apiScript, 'Active API differs from recorded API');
  const assertApi = () => {
    const after = inspect();
    assert.equal(after.apiPid, before.apiPid, 'API PID changed');
    assert.equal(after.apiScript, before.apiScript, 'API script changed');
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

async function host([operation, target, approval, approvedApproval, enabled, expectedBuild, healthyJson, run, attempt, approvedTarget]) {
  const healthy = JSON.parse(healthyJson);
  authorize({operation, target, approval, approvedApproval, enabled, expectedBuild, healthy, approvedTarget});
  assert.match(run, /^[1-9][0-9]*$/);
  assert.match(attempt, /^[1-9][0-9]*$/);
  const root = '/root/mateyou';
  const control = path.join(root, '_recovery');
  const releases = path.join(control, 'releases');
  const staticRoot = '/var/www/mateyou/static';
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
  const processes = () => {
    const rows = JSON.parse(pm2(['jlist']));
    const web = rows.filter(row => row.name === 'mateyou-web');
    const api = rows.filter(row => row.name === 'mateyou-api');
    assert.equal(web.length, 1);
    assert.equal(api.length, 1);
    assert.ok(api[0].pid > 0 && api[0].pm2_env.status === 'online', 'API baseline unavailable');
    return {web: web[0].pm2_env, apiPid: api[0].pid, apiScript: api[0].pm2_env.pm_exec_path,
      webScript: web[0].pm2_env.pm_exec_path};
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
    await checkPages(release, 'http://127.0.0.1:3000');
    await checkPages(release, 'https://www.longvon.com');
    const api = await fetch('http://127.0.0.1:4000/health/live',
      {redirect: 'error', signal: AbortSignal.timeout(4000)});
    assert.equal(api.status, 200, 'API liveness failed');
    assert.equal((await api.json()).status, 'ok', 'Unexpected API liveness response');
    const manifest = read(path.join(artifact(release.id), 'web-manifest.json'));
    for (const [name, checksum] of Object.entries(manifest.staticFiles)) {
      const response = await fetch('https://www.longvon.com/_next/static/' + name,
        {redirect: 'error', signal: AbortSignal.timeout(4000)});
      assert.equal(response.status, 200);
      assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'), checksum);
    }
  }, {timeoutMs: 60000});
  fs.mkdirSync(lock, {mode: 0o700});
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
    let next;
    await activate({
      previous, target: {webScript: script(target)}, inspect: processes, event, save: () => pm2(['save']),
      verifyPrevious: operation === 'release',
      prepare: async () => {
        if (operation === 'release') {
          assert.ok(healthy.includes(previous.id), 'Current version is not an accepted rollback baseline');
          fs.mkdirSync(path.dirname(artifact(target)), {mode: 0o700});
          fs.renameSync(path.join(stage, 'web'), artifact(target));
          publish({artifact: artifact(target), staticRoot});
          next = {...previous, id: target, webScript: script(target), phase: 'geo',
            commit: '139ff275ac29920b1bb8d119ed2ad1d1262b3627', routeCount: 72};
        } else {
          const stored = read(path.join(releases, target, 'record.json'));
          assert.equal(stored.id, target);
          assert.equal(stored.webScript, script(target));
          next = {...previous, id: target, webScript: stored.webScript, commit: stored.commit,
            phase: stored.phase, routeCount: stored.routeCount, rollbackFrom: previous.id};
        }
        assertReady({artifact: artifact(target), staticRoot});
        const preflight = spawn(process.execPath, [next.webScript], {cwd: root,
          env: {...snapshot.env, PORT: '3101', HOSTNAME: '127.0.0.1'}, stdio: 'ignore'});
        let startError;
        preflight.once('error', error => { startError = error; });
        try {
          await poll(async () => {
            assert.ok(!startError && preflight.exitCode === null && preflight.signalCode === null,
              'Preflight Web did not stay running');
            await checkPages(next, 'http://127.0.0.1:3101');
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
        const config = path.join(stage, 'pm2-private.json');
        fs.writeFileSync(config, JSON.stringify({apps: [{name: 'mateyou-web', script: webScript, cwd: root,
          env: snapshot.env, exec_mode: 'fork', instances: 1, interpreter: snapshot.exec_interpreter,
          node_args: snapshot.node_args, kill_timeout: snapshot.kill_timeout,
          max_memory_restart: snapshot.max_memory_restart, out_file: snapshot.pm_out_log_path,
          error_file: snapshot.pm_err_log_path, autorestart: snapshot.autorestart}]}), {mode: 0o600});
        try {
          if (JSON.parse(pm2(['jlist'])).some(row => row.name === 'mateyou-web')) pm2(['delete', 'mateyou-web']);
          pm2(['start', config, '--only', 'mateyou-web']);
        } finally { fs.rmSync(config, {force: true}); }
      },
      record: () => {
        if (operation === 'release') fs.writeFileSync(path.join(releases, target, 'record.json'),
          JSON.stringify(next), {mode: 0o600, flag: 'wx'});
        const pending = path.join(stage, 'active.json');
        fs.writeFileSync(pending, JSON.stringify(next), {mode: 0o600, flag: 'wx'});
        fs.renameSync(pending, activeFile);
      }
    });
  } catch (error) {
    event('failed');
    throw error;
  } finally { fs.rmdirSync(lock); }
}

module.exports = {authorize, activate};
if (require.main === module) host(process.argv.slice(2)).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
