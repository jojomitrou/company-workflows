'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { classifyIntent, getProjectName, parseHistoryLine, extractTokensFromSession, findUserMessageUuid, buildPromptDataset, generateHtml } = require('./generate.js');

test('classifyIntent returns Other for empty string', () => {
  assert.equal(classifyIntent(''), 'Other');
});

test('classifyIntent: debug keywords', () => {
  assert.equal(classifyIntent('please fix this bug'), 'Debug/Fix');
  assert.equal(classifyIntent('there is an error in line 5'), 'Debug/Fix');
  assert.equal(classifyIntent('debug the broken function'), 'Debug/Fix');
});

test('classifyIntent: question keywords', () => {
  assert.equal(classifyIntent('explain how this works'), 'Question');
  assert.equal(classifyIntent('what does this do'), 'Question');
  assert.equal(classifyIntent('why is this happening'), 'Question');
});

test('classifyIntent: create keywords', () => {
  assert.equal(classifyIntent('write a function to sort'), 'Create/Build');
  assert.equal(classifyIntent('create a new component'), 'Create/Build');
  assert.equal(classifyIntent('add a button here'), 'Create/Build');
});

test('classifyIntent: review keywords', () => {
  assert.equal(classifyIntent('review this code'), 'Review');
  assert.equal(classifyIntent('check if this is correct'), 'Review');
});

test('classifyIntent: refactor keywords', () => {
  assert.equal(classifyIntent('refactor this module'), 'Refactor');
  assert.equal(classifyIntent('optimize the query'), 'Refactor');
});

test('classifyIntent: Other for no match', () => {
  assert.equal(classifyIntent('hello'), 'Other');
  assert.equal(classifyIntent('connect to github'), 'Other');
});

test('classifyIntent: first match wins (debug beats create)', () => {
  assert.equal(classifyIntent('fix and create something'), 'Debug/Fix');
});

test('getProjectName: returns last path segment', () => {
  assert.equal(getProjectName('C:\\Users\\jomqu\\my-project'), 'my-project');
  assert.equal(getProjectName('/home/user/src/repo'), 'repo');
});

test('getProjectName: handles trailing slash', () => {
  assert.equal(getProjectName('C:\\Users\\jomqu\\my-project\\'), 'my-project');
});

test('getProjectName: handles empty/null', () => {
  assert.equal(getProjectName(''), 'Unknown');
  assert.equal(getProjectName(null), 'Unknown');
});

test('parseHistoryLine: parses valid JSON line', () => {
  const line = JSON.stringify({
    display: 'hello world',
    timestamp: 1748432858000,
    project: 'C:\\Users\\test\\my-proj',
    sessionId: 'abc-123',
  });
  const result = parseHistoryLine(line);
  assert.equal(result.text, 'hello world');
  assert.equal(result.sessionId, 'abc-123');
  assert.equal(result.project, 'my-proj');
  assert.equal(result.intent, 'Other');
  assert.equal(result.inputTokens, 0);
  assert.ok(result.timestamp instanceof Date);
});

test('parseHistoryLine: returns null for malformed line', () => {
  assert.equal(parseHistoryLine('not json'), null);
  assert.equal(parseHistoryLine(''), null);
});

test('parseHistoryLine: returns null for missing timestamp', () => {
  const line = JSON.stringify({ display: 'hello', project: 'C:\\test', sessionId: 's1' });
  assert.equal(parseHistoryLine(line), null);
});

test('parseHistoryLine: returns null for invalid timestamp', () => {
  const line = JSON.stringify({ display: 'hello', timestamp: 'not-a-date', project: 'C:\\test', sessionId: 's1' });
  assert.equal(parseHistoryLine(line), null);
});

test('extractTokensFromSession: extracts token data from assistant messages', () => {
  const tmpFile = path.join(os.tmpdir(), 'test-session-extract.jsonl');
  const lines = [
    JSON.stringify({ type: 'user', uuid: 'user-uuid-1', timestamp: '2026-01-01T00:00:00Z', message: { role: 'user', content: 'hello' } }),
    JSON.stringify({ type: 'assistant', parentUuid: 'user-uuid-1', message: { role: 'assistant', usage: { input_tokens: 100, output_tokens: 50, cache_creation_input_tokens: 200, cache_read_input_tokens: 300 } } }),
  ];
  fs.writeFileSync(tmpFile, lines.join('\n'));

  const map = extractTokensFromSession(tmpFile);
  assert.equal(map.get('user-uuid-1').inputTokens, 100);
  assert.equal(map.get('user-uuid-1').outputTokens, 50);
  assert.equal(map.get('user-uuid-1').cacheTokens, 500);

  fs.unlinkSync(tmpFile);
});

test('extractTokensFromSession: ignores entries without usage', () => {
  const tmpFile = path.join(os.tmpdir(), 'test-session-nousage.jsonl');
  const lines = [
    JSON.stringify({ type: 'assistant', parentUuid: 'user-uuid-2', message: { role: 'assistant' } }),
  ];
  fs.writeFileSync(tmpFile, lines.join('\n'));

  const map = extractTokensFromSession(tmpFile);
  assert.equal(map.size, 0);

  fs.unlinkSync(tmpFile);
});

test('extractTokensFromSession: returns empty map for missing file', () => {
  const map = extractTokensFromSession('/nonexistent/path/file.jsonl');
  assert.equal(map.size, 0);
});

test('findUserMessageUuid: finds uuid closest to target timestamp', () => {
  const tmpFile = path.join(os.tmpdir(), 'test-session-uuid.jsonl');
  const ts = '2026-05-28T12:51:59.000Z';
  const lines = [
    JSON.stringify({ type: 'user', uuid: 'user-a', timestamp: '2026-05-28T12:51:55.000Z', message: { role: 'user' } }),
    JSON.stringify({ type: 'user', uuid: 'user-b', timestamp: ts, message: { role: 'user' } }),
    JSON.stringify({ type: 'tool_result', uuid: 'tool-1' }),
  ];
  fs.writeFileSync(tmpFile, lines.join('\n'));

  const result = findUserMessageUuid(tmpFile, new Date(ts));
  assert.equal(result, 'user-b');

  fs.unlinkSync(tmpFile);
});

test('findUserMessageUuid: returns null when no match within 5s', () => {
  const tmpFile = path.join(os.tmpdir(), 'test-session-nomatch.jsonl');
  const lines = [
    JSON.stringify({ type: 'user', uuid: 'user-x', timestamp: '2026-01-01T00:00:00Z', message: { role: 'user' } }),
  ];
  fs.writeFileSync(tmpFile, lines.join('\n'));

  const result = findUserMessageUuid(tmpFile, new Date('2026-05-28T12:00:00Z'));
  assert.equal(result, null);

  fs.unlinkSync(tmpFile);
});

test('buildPromptDataset: attaches token data to matching prompts', () => {
  const tmpDir = path.join(os.tmpdir(), 'test-claude-' + Date.now());
  fs.mkdirSync(tmpDir);

  // history.jsonl
  const ts = 1748432858000;
  const historyPath = path.join(tmpDir, 'history.jsonl');
  fs.writeFileSync(historyPath, JSON.stringify({
    display: 'fix the bug', timestamp: ts, project: tmpDir, sessionId: 'sess-1',
  }) + '\n');

  // session file under projects/<dir>/sess-1.jsonl
  const projectDir = path.join(tmpDir, 'projects', 'myproject');
  fs.mkdirSync(projectDir, { recursive: true });
  const sessionPath = path.join(projectDir, 'sess-1.jsonl');
  const isoTs = new Date(ts).toISOString();
  fs.writeFileSync(sessionPath, [
    JSON.stringify({ type: 'user', uuid: 'u-1', timestamp: isoTs, message: { role: 'user', content: 'fix the bug' } }),
    JSON.stringify({ type: 'assistant', parentUuid: 'u-1', message: { role: 'assistant', usage: { input_tokens: 500, output_tokens: 200, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } }),
  ].join('\n'));

  const { prompts, skipped } = buildPromptDataset(historyPath, path.join(tmpDir, 'projects'));
  assert.equal(prompts.length, 1);
  assert.equal(prompts[0].inputTokens, 500);
  assert.equal(prompts[0].outputTokens, 200);
  assert.equal(skipped, 0);

  fs.rmSync(tmpDir, { recursive: true });
});

test('generateHtml: returns HTML string containing dashboard markup', () => {
  const historyPath = path.join(os.homedir(), '.claude', 'history.jsonl');
  const projectsDir = path.join(os.homedir(), '.claude', 'projects');
  const html = generateHtml(historyPath, projectsDir);
  assert.ok(typeof html === 'string');
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('Claude Code Activity'));
  assert.ok(!html.includes('/*__DATA__*/'));
  assert.ok(!html.includes('/*__GENERATED_AT__*/'));
  assert.ok(!html.includes('/*__PROJECT_COUNT__*/'));
});

test('generateHtml: returns error HTML when history not found', () => {
  const html = generateHtml('/nonexistent/path/history.jsonl', '/nonexistent/projects');
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('Error'));
  assert.ok(html.includes('not found'));
});
