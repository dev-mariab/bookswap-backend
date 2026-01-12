import { Book } from '../models/Book';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  create(bookData: any): Promise<Book>;
  update(id: string, bookData: any): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
  findByCourse(course: string): Promise<Book[]>;
  findByCondition(condition: string): Promise<Book[]>;
}

export class BookRepository implements IBookRepository {
  async findAll(): Promise<Book[]> {
    return await Book.findAll();
  }
  
  async findById(id: string): Promise<Book | null> {
    return await Book.findByPk(id);
  }
  
  async create(bookData: any): Promise<Book> {
    return await Book.create(bookData);
  }
  
  async update(id: string, bookData: any): Promise<Book | null> {
    const book = await Book.findByPk(id);
    if (book) {
      return await book.update(bookData);
    }
    return null;
  }
  
  async delete(id: string): Promise<boolean> {
    const deleted = await Book.destroy({ where: { id } });
    return deleted > 0;
  }
  
  async findByCourse(course: string): Promise<Book[]> {
    return await Book.findAll({ 
      where: { curso: course } 
    });
  }
  
  async findByCondition(condition: string): Promise<Book[]> {
    return await Book.findAll({ 
      where: { condicao: condition } 
    });
  }
}

export class CachedBookRepository implements IBookRepository {
  private repository: IBookRepository;
  private cache: Map<string, any> = new Map();
  
  constructor(repository: IBookRepository) {
    this.repository = repository;
  }
  
  async findAll(): Promise<Book[]> {
    const cacheKey = 'books_all';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const books = await this.repository.findAll();
    this.cache.set(cacheKey, books);
    return books;
  }
  
  async create(bookData: any): Promise<Book> {
    this.cache.delete('books_all');
    return await this.repository.create(bookData);
  }
  
  async findById(id: string): Promise<Book | null> {
    return await this.repository.findById(id);
  }
  
  async update(id: string, bookData: any): Promise<Book | null> {
    this.cache.delete('books_all');
    return await this.repository.update(id, bookData);
  }
  
  async delete(id: string): Promise<boolean> {
    this.cache.delete('books_all');
    return await this.repository.delete(id);
  }
  
  async findByCourse(course: string): Promise<Book[]> {
    return await this.repository.findByCourse(course);
  }
  
  async findByCondition(condition: string): Promise<Book[]> {
    return await this.repository.findByCondition(condition);
  }
}
