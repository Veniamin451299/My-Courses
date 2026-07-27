const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  const stream = fs.createReadStream(process.argv[3]);
  stream.on('error', (err) => { 
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end(`File Error: ${err.message}`);
});
}).listen(Number(process.argv[2]));