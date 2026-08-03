// path: backend/src/middleware/validator.js
const { z } = require('zod');
const { BadRequestError } = require('../errorHandler');

/**
 * ЗАЩИТА ОТ XSS-атак: Функция-помощник, которая превращает кусок HTML в безопасный текст
 * Например, строку "<script>" она превратит в "&lt;script&gt;", и браузер её не выполнит
 */
const sanitizeString = (val) => val.replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Описываем схему валидции данных для задач
const toDoSchema = z.object({
  title: z.string({ required_error: 'Название задачи обязательно' })
        .min(2, 'Название задачи слишком короткое')
        .transform(sanitizeString), // автоматически очистит title

  description: z.string({ required_error: 'Описание задачи обязательно' })
        .min(2, 'Описание задачи слишком короткое')
        .transform(sanitizeString), // автоматически очистит description
});

// Оаисываем схему валидации данных для регистрации
const registerSchema = z.object({
  email: z.string({ required_error: 'Электронная почта пользователя обязательна' })
        .min(6, 'Электронная почта слишком короткая')
        .transform(sanitizeString) // автоматически очистит email
        .email('Некорректный адрес электронной почты')
        .toLowerCase(),


  password: z.string({ required_error: 'Пароль пользователя обязателен' })
        .min(8, 'Пароль пользователя слишком короткий')
        .max(20, 'Пароль пользователя слишком длинный')
        .transform(sanitizeString),
})

// Создаем универсальный мидлварь-валидатор
const validator = (schema) => (req, res, next) => {
    try {
        // parse() проверяет req.body. Если данные плохие — вызовет ошибку.
        schema.parse(req.body);
        next(); // Если все ОК, то передаем управление к контроллеру
    } catch (error) {
        // Если Zod нашел ошибки, мы форматируем их и отправляем статус 400 (Bad Request)
        const errorMessage = error.errors.map(error => error.message).join(', ');
        next(new BadRequestError(errorMessage));
    }
}

module.exports = { validator, toDoSchema, registerSchema };
