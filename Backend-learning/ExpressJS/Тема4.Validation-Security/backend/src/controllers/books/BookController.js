// path: backend/src/controllers/books/BookController.js
const BookService = require('../../services/books/BookService');
const { NotFoundError, InternalServerError } = require('../../middleware/ErrorHandler'); 

class BookController { 
    getBooks(req, res, next) { 
        try{
            const books = BookService.getBooks();
            if (!books) return next(new NotFoundError('Books not found'));
            res.json(books);
        } catch (error) { 
            next(new InternalServerError(`Internal server error: ${error.message}`));
        }
    }
    getBookById(req, res, next) { 
        try{
            const book = BookService.getBookById(req.params.id);
            if (!book) return next(new NotFoundError('Book not found'));
            res.json(book);
        } catch (error) { 
            next(new InternalServerError(`Internal server error: ${error.message}`));
        }
    }

    addBook(req, res, next) {
        try{
            const book = BookService.addBook(req.body);
            if (!book) return next(new NotFoundError('Book not found'));
            res.json(book);
        } catch (error) { 
            next(new InternalServerError(`Internal server error: ${error.message}`));
        }
    }

    updateBook(req, res, next) { 
        try{
            const book = BookService.updateBook(req.params.id, req.body);
            if (!book) return next(new NotFoundError('Book not found'));
            res.json(book);
        } catch (error) { 
            next(new InternalServerError(`Internal server error: ${error.message}`));
        }
    }

    deleteBook(req, res, next) { 
        try{
            const book = BookService.deleteBook(req.params.id);
            if (!book) return next(new NotFoundError('Book not found'));
            res.json(book);
        } catch (error) { 
            next(new InternalServerError(`Internal server error: ${error.message}`));
        }
    }
}

module.exports = new BookController();