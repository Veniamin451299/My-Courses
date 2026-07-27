// path: backend/src/routes/bookRouter.js
const { Router } = require('express');
const { bookSchema, validator } = require('../middleware/validators/validator');
const bookController = require('../controllers/books/bookController');

const router = Router();

// GET /books - Получение всех книг
router.get('/', bookController.getBooks);

// GET /books/:id - Получение книги по ID
router.get('/:id', bookController.getBookById);

// POST /books - Добавление книги
router.post('/', validator(bookSchema), bookController.addBook);

// PUT /books/:id - Обновление книги
router.put('/:id', validator(bookSchema), bookController.updateBook);

// DELETE /books/:id - Удаление книги
router.delete('/:id', bookController.deleteBook);

module.exports = router;