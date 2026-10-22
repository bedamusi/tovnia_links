const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 8000);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const requestedPath = pathname === '/' ? '/index.html' : pathname === '/dashboard' ? '/dashboard.html' : pathname === '/join' ? '/join.html' : pathname;
  const filePath = path.resolve(root, `.${requestedPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stats.size,
      'X-Content-Type-Options': 'nosniff',
    });
    fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(port, host, () => {
  console.log(`VeqnoLink is running at http://${host}:${port}/`);
});

server.on('error', (error) => {
  console.error(`Could not start VeqnoLink: ${error.message}`);
  process.exitCode = 1;
});
