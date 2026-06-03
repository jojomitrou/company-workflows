'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('./serve.js');

function request(server, urlPath) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.get(`http://localhost:${port}${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
  });
}

test('GET / returns 200 with HTML containing dashboard', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const res = await request(server, '/');
  assert.equal(res.status, 200);
  assert.ok(res.headers['content-type'].includes('text/html'));
  assert.ok(res.body.includes('Claude Code Activity'));
  assert.ok(res.body.includes('<!DOCTYPE html>'));
  await new Promise(resolve => server.close(resolve));
});

test('GET /other returns 404', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const res = await request(server, '/favicon.ico');
  assert.equal(res.status, 404);
  await new Promise(resolve => server.close(resolve));
});
