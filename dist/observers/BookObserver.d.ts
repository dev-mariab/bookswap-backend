export interface Observer {
    update(data: any): void;
}
export interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(data: any): void;
}
export declare class BookSubject implements Subject {
    private observers;
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(data: any): void;
}
export declare class BookListObserver implements Observer {
    private updateCallback;
    constructor(callback: (data: any) => void);
    update(data: any): void;
}
export declare class BookObserverManager {
    private static instance;
    static getInstance(): BookSubject;
}
//# sourceMappingURL=BookObserver.d.ts.map