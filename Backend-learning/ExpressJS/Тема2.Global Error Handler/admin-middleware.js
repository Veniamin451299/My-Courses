const express = require('express');

const app = express();

const checkAdmin = (req, res, next) => {
    if (req.query.role !== 'admin') {
       const error = new Error('Доступ запрещен');
       error.statusCode = 403;
       return next(error);
    } 
    next();
}

app.get('/secret', checkAdmin, (req, res, next) =>{
    // Имитируем внезапную ошибку (например, упала база данных)
    const error = new Error('I\'m a teapot');
    error.statusCode = 418;
    next(error); // Передаем ошибку в глобальный обработчик!!!
});

app.get('/books/:id', (req, res, next) => {
    const book = findBookInDB(req.params.id); // Ищем книгу
    
    if (!book) {
        const error = new Error('Книга с таким ID не найдена');
        error.statusCode = 404; // Присваиваем кастомный статус ошибки
        return next(error);     // Отправляем в глобальный обработчик
    }
    
    res.json(book);
});

const errorHandler = (err, req, res, next) => {
    // Если статус пришел вместе с ошибкой — берем его, иначе ставим 500
    const statusCode = err.statusCode || 500;
    
    // В реальном продакшене системную ошибку обязательно логируют в файлы/консоль
    if (statusCode === 500) {
        console.error('КРИТИЧЕСКИЙ СБОЙ СЕРВЕРА:', err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: err.message || 'Внутренняя ошибка сервера'
    });
};

app.use(errorHandler); // Глобальный обработчик ошибок - зарегестрируем его

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


/***
 * Создание собственных классов ошибок (Middle/Senior подход)В больших проектах разработчики
 *  создают свои классы для каждого типа ошибок. Это делает код невероятно чистым:
 * // Создаем красивый класс для 404 ошибок
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

// Создаем класс для 400 ошибок
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
Тогда внутри роута ты будешь писать супер-читаемый код:
if (!book) return next(new NotFoundError('Книга не найдена'));*/ 