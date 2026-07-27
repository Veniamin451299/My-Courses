// Разбор тела POST-запроса (Body Parser)
const http = require('http');

http.createServer((req, res) => {
  try {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        return res.end("Send a POST request\n");
    }

    let body = [];

    // Слушаем прилетающие чанки
    req.on('data', (chunk) => {
      body.push(chunk);     // Просто копим их в массиве
    });

    // Этот колбэк сработает ОДИН раз, когда весь JSON прилетит полностью
    req.on('end', () => {
        try {
            body = Buffer.concat(body).toString();  // Склеиваем все буферы в одну готовую строку
            const dataJSON = JSON.parse(body);      // Парсим всю строку целиком в объект JavaScript
            dataJSON.status = "active";
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(dataJSON));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end("Invalid JSON data!\n");
        }
    });

  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end("Internal Server Error: ", err.message);
  }
}).listen(Number(process.argv[2]));