const http = require('http');
const map = require('through2-map');

http.createServer((req, res) => {
  // Отсекаем всё, кроме POST
  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'text/plain' }); // 405 Method Not Allowed
    return res.end('Send me a POST request\n');
  }

  const stream = req.pipe(map((chunk) => {
    return chunk.toString().toUpperCase();
  })).pipe(res);

  stream.on('error', (err) => { 
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end(`File Error: ${err.message}`);
});

res.writeHead(200, { 'content-type': 'text/plain' });
}).listen(Number(process.argv[2]));