/// <reference path="../../../../my-typings/lib.es6.d.ts" />
export interface ICallback {
    (newValue: any): any;
}

export class Observable {
    private observers: Set<ICallback>;

    constructor() {
        this.observers = new Set();
    }

    registerObserver(callback: ICallback): void {
        this.observers.add(callback);
    }

    removeObserver(callback: ICallback): void {
        this.observers.delete(callback);
    }

    removeAllObservers(): void {
        this.observers.clear();
    }

    notifyObservers (value : any) : void {
        this.observers.forEach((observer: ICallback)=> {
            observer(value);
        });
    }
}