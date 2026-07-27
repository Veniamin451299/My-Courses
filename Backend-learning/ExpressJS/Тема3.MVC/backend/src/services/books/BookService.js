// path: backend/src/services/books/BookService.js

// Аналог БД
const booksDatabase = [
    { id: '1', title: 'Book 1', author: 'Author 1' },
    { id: '2', title: 'Book 2', author: 'Author 2' },
    { id: '3', title: 'Book 3', author: 'Author 3' },
];

class BooksService {
    getBooks() {
        return booksDatabase;
    }

    getBookById(id) {
        return booksDatabase.find(book => book.id === id);
    }

    addBook(book) {
        booksDatabase.push(book);
        return book;
    }

    updateBook(id, book) {
        const index = booksDatabase.findIndex(book => book.id === id);
        if (index === -1) return null;
        booksDatabase[index] = { ...booksDatabase[index], ...book };
        return booksDatabase[index];
    }

    deleteBook(id) {
        const index = booksDatabase.findIndex(book => book.id === id);
        if (index !== -1) return booksDatabase.splice(index, 1)[0];
        return null;
    }
}

module.exports = new BooksService();