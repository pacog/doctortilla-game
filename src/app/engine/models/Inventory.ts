import { Observable, ICallback } from '../utils/Observable';
import { Thing } from './Thing';

export class Inventory {

    private changeObservable : Observable;
    items: Set<Thing>;

    constructor() {
        this.changeObservable = new Observable();
        this.items = new Set();
    }

    subscribeToChange(callback: ICallback) : void {
        this.changeObservable.registerObserver(callback);
    }

    unsubscribeToChange(callback: ICallback) : void {
        this.changeObservable.removeObserver(callback);
    }

    add(item: Thing) {
        item.state.set('IS_IN_INVENTORY', true);
        this.items.add(item);
        this.changeObservable.notifyObservers(this);
    }

    remove(item: Thing) {
        this.items.delete(item);
        this.changeObservable.notifyObservers(this);
    }

    getById(id: string): Thing {
        let itemArray = Array.from(this.items);
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i].id === id) {
                return itemArray[i];
            }
        }
        return null;
    }

}