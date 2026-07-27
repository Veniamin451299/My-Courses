const http = require('http');

function parsetime(time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  };
}

function unixtime(time) {
  return { unixtime: time.getTime() };
}

http.createServer((req, res) => {
  const parseUrl = new URL(req.url, 'http://example.com');
  const path = parseUrl.pathname;
  const isoString = parseUrl.searchParams.get('iso');
  const time = new Date(isoString);

  // СТЕПЕНЬ ЗАЩИТЫ 1: Проверяем валидность даты на самом входе
  if (!isoString || isNaN(time.getTime())) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('ISO parameter is missing or invalid!'); // return обрывает выполнение функции
  }

  // СТЕПЕНЬ ЗАЩИТЫ 2: Один try/catch на все роуты сразу! 
  try {
    let result;

    if (path === '/api/parsetime') {
      result = parsetime(time);
    } else if (path === '/api/unixtime') {
      result = unixtime(time);
    } else {
      // Если роут не совпал — отдаем 404 и выходим
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Unknown request received');
    }

    // Если мы дошли сюда, значит роут верный и данные готовы
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));

  } catch (err) {
    // Этот блок поймает ошибку, если что-то сломается внутри parsetime или unixtime
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Server Error: ${err.message}`);
  }

}).listen(Number(process.argv[2]));
