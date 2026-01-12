"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookObserverManager = exports.BookListObserver = exports.BookSubject = void 0;
class BookSubject {
    constructor() {
        this.observers = [];
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notify(data) {
        this.observers.forEach(observer => {
            observer.update(data);
        });
    }
}
exports.BookSubject = BookSubject;
class BookListObserver {
    constructor(callback) {
        this.updateCallback = callback;
    }
    update(data) {
        this.updateCallback(data);
    }
}
exports.BookListObserver = BookListObserver;
class BookObserverManager {
    static getInstance() {
        if (!BookObserverManager.instance) {
            BookObserverManager.instance = new BookSubject();
        }
        return BookObserverManager.instance;
    }
}
exports.BookObserverManager = BookObserverManager;
//# sourceMappingURL=BookObserver.js.map