import { Observable, ICallback } from '../utils/Observable';
import { Inventory } from '../models/Inventory';

class ActiveInventory {

    private changeObservable: Observable;
    private activeInventory: Inventory;
    private onInventoryChangeBinded: ICallback;

    constructor() {
        this.changeObservable = new Observable();
        this.onInventoryChangeBinded = ((newValue) => {
            this.changeObservable.notifyObservers(newValue);
        });
    }

    setActiveInventory(newInventory: Inventory): void {
        this.removeOldInventoryEvents();
        this.activeInventory = newInventory;
        this.createNewInventoryEvents();
        this.notifySubscribers();
    }

    getActiveInventory(): Inventory {
        return this.activeInventory;
    }

    refresh(): void {
        this.notifySubscribers();
    }

    subscribeToChange(callback: ICallback): void {
        this.changeObservable.registerObserver(callback);
    }

    unsubscribeToChange(callback: ICallback): void {
        this.changeObservable.removeObserver(callback);
    }

    private removeOldInventoryEvents(): void {
        if (this.activeInventory) {
            this.activeInventory.unsubscribeToChange(this.onInventoryChangeBinded);
        }
    }

    private createNewInventoryEvents(): void {
        if (this.activeInventory) {
            this.activeInventory.subscribeToChange(this.onInventoryChangeBinded);
        }
    }

    private notifySubscribers(): void {
        this.changeObservable.notifyObservers(this.activeInventory);
    }
}

export const activeInventory = new ActiveInventory();