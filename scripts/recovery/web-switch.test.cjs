const {test} = require('node:test');
const assert = require('node:assert/strict');
const {authorize, activate} = require('./web-switch.cjs');

const healthy = 'actions-1-1';
const next = 'actions-2-1';
const approved = {enabled: 'true', approval: 'CHANGE-001', approvedApproval: 'CHANGE-001',
  expectedBuild: 'ZnlTrzgQe8jRRz-9KhnP_', healthy: [healthy], operation: 'release', target: next};

test('missing handoff and unrelated approval both fail closed', () => {
  authorize(approved);
  assert.throws(() => authorize({...approved, enabled: ''}), /blocked/);
  assert.throws(() => authorize({...approved, approval: 'CHANGE-002'}), /approval/i);
});

test('rollback accepts only the approved healthy identifier', () => {
  const rollback = {...approved, operation: 'rollback', target: healthy, approvedTarget: healthy};
  authorize(rollback);
  assert.throws(() => authorize({...rollback, target: '../web'}));
  assert.throws(() => authorize({...rollback, target: next, approvedTarget: next}), /healthy/);
  assert.throws(() => authorize({...rollback, approvedTarget: next}), /differs/);
});

function mock(previous, target, fail = false) {
  let active = previous.webScript;
  let saved = active;
  const events = [];
  const commands = [];
  return {
    events, commands, state: () => ({active, saved}),
    options: {
      previous, target, inspect: () => ({apiPid: 41, apiScript: 'api', webScript: active}),
      prepare: () => commands.push('prepare Web'),
      switchWeb: script => { commands.push('switch Web'); active = script; },
      check: release => {
        if (fail && release === target) throw new Error('Mock Web health failure');
        assert.equal(active, release.webScript);
      },
      save: () => commands.push('save PM2'),
      record: release => { saved = release.webScript; },
      event: value => events.push(value)
    }
  };
}
const previous = {webScript: 'healthy-Web', apiScript: 'api'};
const target = {webScript: 'candidate-Web', apiScript: 'api'};

test('successful release and independent rollback commit Web only', async () => {
  for (const [from, to] of [[previous, target], [target, previous]]) {
    const m = mock(from, to);
    await activate(m.options);
    assert.deepEqual(m.state(), {active: to.webScript, saved: to.webScript});
    assert.deepEqual(m.events, ['switch-started', 'committed']);
    assert.deepEqual(m.commands, ['prepare Web', 'switch Web', 'save PM2']);
  }
});

test('failed Web health restores previous Web without committing candidate', async () => {
  const m = mock(previous, target, true);
  await assert.rejects(activate(m.options), /Mock Web health failure/);
  assert.deepEqual(m.state(), {active: previous.webScript, saved: previous.webScript});
  assert.deepEqual(m.events, ['switch-started', 'recovered']);
  assert.deepEqual(m.commands, ['prepare Web', 'switch Web', 'switch Web', 'save PM2']);
});

test('unexpected API PID blocks cutover', async () => {
  const m = mock(previous, target);
  let inspections = 0;
  const inspect = m.options.inspect;
  m.options.inspect = () => ({...inspect(), apiPid: ++inspections === 1 ? 41 : 42});
  await assert.rejects(activate(m.options), /API PID changed/);
  assert.deepEqual(m.commands, ['prepare Web']);
});
