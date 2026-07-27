// Безопасная асинхронная работа с файлами
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    try {
        if (req.method !== 'GET') {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            return res.end("Send a get request!");
        }

        if (req.url !== '/logs') {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            return res.end("Incorrect URL");
        }

        fs.readFile('app.log', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                return res.end(`Файл логов не нейден: ${err.message}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Internal Server Error", err.message);
    }
}).listen(Number(process.argv[2]));