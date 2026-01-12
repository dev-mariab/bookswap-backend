"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedBookRepository = exports.BookRepository = void 0;
const Book_1 = require("../models/Book");
class BookRepository {
    async findAll() {
        return await Book_1.Book.findAll();
    }
    async findById(id) {
        return await Book_1.Book.findByPk(id);
    }
    async create(bookData) {
        return await Book_1.Book.create(bookData);
    }
    async update(id, bookData) {
        const book = await Book_1.Book.findByPk(id);
        if (book) {
            return await book.update(bookData);
        }
        return null;
    }
    async delete(id) {
        const deleted = await Book_1.Book.destroy({ where: { id } });
        return deleted > 0;
    }
    async findByCourse(course) {
        return await Book_1.Book.findAll({
            where: { curso: course }
        });
    }
    async findByCondition(condition) {
        return await Book_1.Book.findAll({
            where: { condicao: condition }
        });
    }
}
exports.BookRepository = BookRepository;
class CachedBookRepository {
    constructor(repository) {
        this.cache = new Map();
        this.repository = repository;
    }
    async findAll() {
        const cacheKey = 'books_all';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const books = await this.repository.findAll();
        this.cache.set(cacheKey, books);
        return books;
    }
    async create(bookData) {
        this.cache.delete('books_all');
        return await this.repository.create(bookData);
    }
    async findById(id) {
        return await this.repository.findById(id);
    }
    async update(id, bookData) {
        this.cache.delete('books_all');
        return await this.repository.update(id, bookData);
    }
    async delete(id) {
        this.cache.delete('books_all');
        return await this.repository.delete(id);
    }
    async findByCourse(course) {
        return await this.repository.findByCourse(course);
    }
    async findByCondition(condition) {
        return await this.repository.findByCondition(condition);
    }
}
exports.CachedBookRepository = CachedBookRepository;
//# sourceMappingURL=BookRepository.js.map