// path: backend/src/middleware/validators/validator.js
const { z } = require('zod');
const { BadRequestError } = require('../ErrorHandler');

// 1. Описываем схему валидации для книги
const bookSchema = z.object({
  title: z.string({ required_error: 'Название книги обязательно' })
            .min(2, 'Слишком короткое название'),
  author: z.string({required_error: 'Автор обязателен'})
            .min(2, 'Имя автора слишком короткое'),
});

// 2. Создаем универсальную мидлварь-валидатор
const validator = (schema) => (req, res, next) => {
  try {
    // parse() проверяет req.body. Если данные плохие — вызовет ошибку.
    schema.parse(req.body);
    next(); // Если все ОК, то передаем управление к контроллеру
  } catch (error) {
    // Если Zod нашел ошибки, мы форматируем их и отправляем статус 400 (Bad Request)
    const errorMessage = error.errors.map((e) => e.message).join(', ');
    next(new BadRequestError(errorMessage));
  }
}

module.exports = { validator, bookSchema };