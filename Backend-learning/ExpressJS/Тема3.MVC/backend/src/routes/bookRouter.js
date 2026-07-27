// path: backend/src/routes/bookRouter.js
const { Router } = require('express');
const { getBooks, getBookById, addBook,
     updateBook, deleteBook } = require('../controllers/books/bookController');

const router = Router();

// GET /books - Получение всех книг
router.get('/', getBooks);

// GET /books/:id - Получение книги по ID
router.get('/:id', getBookById);

// POST /books - Добавление книги
router.post('/', addBook);

// PUT /books/:id - Обновление книги
router.put('/:id', updateBook);

// DELETE /books/:id - Удаление книги
router.delete('/:id', deleteBook);

module.exports = router;