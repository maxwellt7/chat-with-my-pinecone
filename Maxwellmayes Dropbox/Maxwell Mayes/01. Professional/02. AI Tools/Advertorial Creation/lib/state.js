// lib/state.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function createState(outputDir) {
  const statePath = join(outputDir, 'state.json');

  function load() {
    if (!existsSync(statePath)) return {};
    return JSON.parse(readFileSync(statePath, 'utf8'));
  }

  function save(data) {
    writeFileSync(statePath, JSON.stringify(data, null, 2));
  }

  return {
    isStepDone(step) {
      return Boolean(load()[step]?.done);
    },
    markStepDone(step, data) {
      const current = load();
      current[step] = { done: true, data };
      save(current);
    },
    getStepData(step) {
      return load()[step]?.data ?? null;
    },
    clearStep(step) {
      const current = load();
      delete current[step];
      save(current);
    }
  };
}
