const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested paths are not supported');
        return;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File does not exist');
        return;
      }

      try {
        fs.unlinkSync(filepath);
        res.statusCode = 200;
        res.end('File was deleted successfully');
        console.log('File was deleted successfully');
      } catch (e) {
        res.statusCode = 500;
        res.end('Unexpected error occured while deleting the file');
        console.log('Error occured while deleting the file');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
