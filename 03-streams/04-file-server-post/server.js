const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested paths are not supported');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File with this name already exists');
        return;
      }

      const outFileStream = fs.createWriteStream(filepath);
      const limitedStream = new LimitSizeStream({
        limit: 1e6,
      });

      req.pipe(limitedStream).pipe(outFileStream);
      req.on('error', () => fs.unlinkSync(filepath));

      limitedStream.on('end', () => {
        res.statusCode = 201;
        res.end('File has been uploaded successfully');
        console.log('File has been uploaded successfully');
      });

      limitedStream.on('error', (err) => {
        fs.unlinkSync(filepath);

        res.statusCode = 413;
        res.end(err.message);
        console.log(err.message);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
