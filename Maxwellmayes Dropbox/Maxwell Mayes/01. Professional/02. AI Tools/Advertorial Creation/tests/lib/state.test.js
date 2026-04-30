// tests/lib/state.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync } from 'node:fs';
import { createState } from '../../lib/state.js';

const TMP = '/tmp/advertorial-test-state';

test('marks step as done and retrieves data', () => {
  mkdirSync(TMP, { recursive: true });
  const state = createState(TMP);
  assert.equal(state.isStepDone('step1'), false);
  state.markStepDone('step1', { foo: 'bar' });
  assert.equal(state.isStepDone('step1'), true);
  assert.deepEqual(state.getStepData('step1'), { foo: 'bar' });
  rmSync(TMP, { recursive: true });
});

test('persists state to disk and reloads on re-create', () => {
  mkdirSync(TMP, { recursive: true });
  const state1 = createState(TMP);
  state1.markStepDone('step1', { result: 42 });

  const state2 = createState(TMP);
  assert.equal(state2.isStepDone('step1'), true);
  assert.deepEqual(state2.getStepData('step1'), { result: 42 });
  rmSync(TMP, { recursive: true });
});

test('clearStep removes a step from state', () => {
  mkdirSync(TMP, { recursive: true });
  const state = createState(TMP);
  state.markStepDone('step1', { x: 1 });
  state.clearStep('step1');
  assert.equal(state.isStepDone('step1'), false);
  rmSync(TMP, { recursive: true });
});
