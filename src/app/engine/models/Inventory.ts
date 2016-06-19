import { Observable, ICallback } from '../utils/Observable';

export class Inventory {

    private changeObservable : Observable;

    constructor() {
        this.changeObservable = new Observable();
    }

    subscribeToChange(callback: ICallback) : void {
        this.changeObservable.registerObserver(callback);
    }

    unsubscribeToChange(callback: ICallback) : void {
        this.changeObservable.removeObserver(callback);
    }

}