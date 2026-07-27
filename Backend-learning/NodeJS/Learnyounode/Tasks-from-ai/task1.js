// Auth Middleware/ Guard - так в современных фреймворках называется проверка авторизации 
const http = require('http');

http.createServer((req, res) => {
    try{
        let requestHeader = req.headers['x-auth-token'];
        
        // Ручная проверка заголовков на наличие разрешающего токена
        if(requestHeader === 'super-secret') {
            res.writeHead(200, { 'content-type': 'text/plain' });
            res.end('Доступ разршен');
        } else {
            res.writeHead(401, { 'content-type': 'text/plain' });
            res.end('Неверный токен');
        }
        
    } catch (err) {
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.end(`Internal server error: ${err.message}`);
    }

}).listen(Number(process.argv[2]));