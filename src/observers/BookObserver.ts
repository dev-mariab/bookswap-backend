export interface Observer {
  update(data: any): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

export class BookSubject implements Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

export class BookListObserver implements Observer {
  private updateCallback: (data: any) => void;
  
  constructor(callback: (data: any) => void) {
    this.updateCallback = callback;
  }
  
  update(data: any): void {
    this.updateCallback(data);
  }
}

export class BookObserverManager {
  private static instance: BookSubject;
  
  static getInstance(): BookSubject {
    if (!BookObserverManager.instance) {
      BookObserverManager.instance = new BookSubject();
    }
    return BookObserverManager.instance;
  }
}
