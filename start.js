const { spawn } = require('child_process');
const path = require('path');

const dir = __dirname;

// Start API server on 8080
const api = spawn('node', ['server/src/app.js'], {
  cwd: dir,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '8080' }
});
api.stdout.on('data', d => process.stdout.write('[API] ' + d));
api.stderr.on('data', d => process.stderr.write('[API-ERR] ' + d));

setTimeout(() => {
  // Start Next.js server on 3000, proxying /api to 8080
  const next = spawn('node', ['-e', `
    const next = require('next');
    const express = require('express');
    const { createProxyMiddleware } = require('http-proxy-middleware');
    const app = next({ dev: false });
    const handle = app.getRequestHandler();
    app.prepare().then(() => {
      const server = express();
      server.use('/api', createProxyMiddleware({
        target: 'http://localhost:8080',
        changeOrigin: true,
      }));
      server.all('*', (req, res) => handle(req, res));
      server.listen(3000, () => console.log('Ready on http://localhost:3000'));
    });
  `], {
    cwd: dir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
  });
  next.stdout.on('data', d => process.stdout.write('[NEXT] ' + d));
  next.stderr.on('data', d => process.stderr.write('[NEXT-ERR] ' + d));
}, 3000);

process.on('SIGINT', () => { api.kill(); process.exit(); });
