class ActiveInventory {

    constructor() {
        this._subscribers = new Set();
        this._activeInventory = null;
        this._onInventoryChangeBinded = this._onInventoryChanged.bind(this);
    }

    setActiveInventory(newInventory) {
        this._removeOldInventoryEvents();
        this._activeInventory = newInventory;
        this._createNewInventoryEvents();
        this._notifySubscribers();
    }

    getActiveInventory() {
        return this._activeInventory;
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
        callback(this._activeInventory);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._activeInventory));
    }

    _removeOldInventoryEvents() {
        if (this._activeInventory) {
            this._activeInventory.unsubscribeToChange(this._onInventoryChangeBinded);
        }
    }

    _createNewInventoryEvents() {
        if (this._activeInventory) {
            this._activeInventory.subscribeToChange(this._onInventoryChangeBinded);
        }
    }

    _onInventoryChanged() {
        this._notifySubscribers();
    }
}
const activeInventory = new ActiveInventory();

module.exports = activeInventory;