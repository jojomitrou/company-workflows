'use strict';
const http = require('http');
const os = require('os');
const path = require('path');
const { generateHtml } = require('./generate.js');

function createServer() {
  const historyPath = path.join(os.homedir(), '.claude', 'history.jsonl');
  const projectsDir = path.join(os.homedir(), '.claude', 'projects');

  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      const html = generateHtml(historyPath, projectsDir);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
}

module.exports = { createServer };

if (require.main === module) {
  const port = parseInt(process.env.PORT || '3000', 10);
  createServer().listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`);
  });
}
