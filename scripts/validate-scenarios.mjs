import assert from 'node:assert/strict';
import fs from 'node:fs';

const fixtureUrl = new URL('../tests/skill-scenarios.json', import.meta.url);
const input = process.argv[2] === '-' ? 0 : (process.argv[2] ?? fixtureUrl);
const fixture = JSON.parse(fs.readFileSync(input, 'utf8'));

assert.equal(fixture.version, 1, 'scenario version must be 1');
assert.ok(Array.isArray(fixture.scenarios), 'scenarios must be an array');
assert.equal(fixture.scenarios.length, 7, 'exactly seven scenarios are required');

const ids = new Set();

for (const [index, scenario] of fixture.scenarios.entries()) {
  const label = `scenario at index ${index}`;

  assert.ok(scenario && typeof scenario === 'object', `${label} must be an object`);
  assert.ok(typeof scenario.id === 'string' && scenario.id.trim(), `${label} id must be non-empty`);
  assert.ok(!ids.has(scenario.id), `duplicate scenario id: ${scenario.id}`);
  ids.add(scenario.id);

  assert.ok(
    typeof scenario.prompt === 'string' && scenario.prompt.trim(),
    `${scenario.id} prompt must be non-empty`,
  );
  assert.ok(Array.isArray(scenario.must), `${scenario.id} must must be an array`);
  assert.ok(scenario.must.length > 0, `${scenario.id} must must not be empty`);
  assert.ok(Array.isArray(scenario.must_not), `${scenario.id} must_not must be an array`);
  assert.ok(scenario.must_not.length > 0, `${scenario.id} must_not must not be empty`);
}

console.log(`Behavior scenarios valid: ${fixture.scenarios.length}`);
