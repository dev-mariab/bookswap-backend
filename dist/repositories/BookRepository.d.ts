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
export declare class BookRepository implements IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: string): Promise<Book | null>;
    create(bookData: any): Promise<Book>;
    update(id: string, bookData: any): Promise<Book | null>;
    delete(id: string): Promise<boolean>;
    findByCourse(course: string): Promise<Book[]>;
    findByCondition(condition: string): Promise<Book[]>;
}
export declare class CachedBookRepository implements IBookRepository {
    private repository;
    private cache;
    constructor(repository: IBookRepository);
    findAll(): Promise<Book[]>;
    create(bookData: any): Promise<Book>;
    findById(id: string): Promise<Book | null>;
    update(id: string, bookData: any): Promise<Book | null>;
    delete(id: string): Promise<boolean>;
    findByCourse(course: string): Promise<Book[]>;
    findByCondition(condition: string): Promise<Book[]>;
}
//# sourceMappingURL=BookRepository.d.ts.map