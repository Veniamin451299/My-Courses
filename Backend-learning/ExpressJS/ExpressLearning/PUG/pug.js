const express = require('express');
const path = require('path');

const app = express();

// указываем путь, в котором находятся шаблоны
app.set('views', process.argv[3] || path.join(__dirname, 'templates')); 
app.set('view engine', 'pug'); // включаем движок, чтобы Express понимал файлы с расширением .pug
app.get('/home', (req, res) => {
    try {
        res.render('index', {date: new Date().toDateString()});
        /***
         * специальный метод ответа (вместо res.send). Он берет файл шаблона (в нашем случае 'index'), 
         * находит внутри него маркер #{date}, заменяет его на реальное значение new Date().toDateString()
         * и отправляет сгенерированный HTML клиенту.
         */
    } catch (e) {
        res.status(404).send(`Templete not found: ${e.message}`);
    }
});
app.listen(Number(process.argv[2]));
