// Первый HTTP запрос GET с выводом данных события, переданного через url
const http = require('http');

const req = process.argv[2];
http.get(req, res => {
    res.setEncoding('utf8');
    res.on('data', data => {
        console.log(data);
    });
    res.on('error', console.error)  // Обработка ошибок ответа
}).on('error', console.error);  // Обработка ошибок запроса