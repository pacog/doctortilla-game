class Inventory {

    constructor() {
        this.items = new Set();
        this._subscribers = new Set();
    }

    add(item) {
        item.state.set('IS_IN_INVENTORY', true);
        this.items.add(item);
        this._notifySubscribers();
    }

    remove(item) {
        this.items.delete(item);
        this._notifySubscribers();
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this));
    }
}

module.exports = Inventory;