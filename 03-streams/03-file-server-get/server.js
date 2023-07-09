const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.split('/').length > 1) {
        res.writeHead(400);
        res.end('Nested paths are not supported');
        return;
      }

      if (!fs.existsSync(filepath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const readableStream = fs.createReadStream(filepath);
      const body = [];

      readableStream.on('data', (chunk) => {
        body.push(chunk);
      });

      readableStream.on('end', () => {
        res.statusCode = 200;
        res.end(Buffer.concat(body));
        console.log('File has been downloaded successfully');
      });

      readableStream.on('error', (err) => {
        res.statusCode = 500;
        res.end('Error occured while reading the file');
        console.log('Error in read stream');
      });

      res.on('error', (err) => {
        res.statusCode = 500;
        res.end('Error occured');
        console.log('Error in write stream');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
