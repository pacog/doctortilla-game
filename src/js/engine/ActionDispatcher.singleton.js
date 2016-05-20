class ActionDispatcher {

    constructor() {
        this._subscribers = new Map();
    }

    execute(action, params) {
        this._notifyAction(action, params);
    }

    subscribeTo(action, callback) {
        let subscribers = this._getSubscribers(action);
        subscribers.add(callback);
    }

    unsubscribeTo(action, callback) {
        let subscribers = this._getSubscribers(action);
        subscribers.delete(callback);
    }

    _getSubscribers(action) {
        let currentSubscribers = this._subscribers.get(action);
        if (!currentSubscribers) {
            currentSubscribers = new Set();
            this._subscribers.set(action, currentSubscribers);
        }
        return currentSubscribers;
    }

    _showUnknowActionError(action) {
        throw 'ERROR: executing incorrect action ' + action;
    }

    _notifyAction(action, params) {
        let subscribers = this._getSubscribers(action);
        subscribers.forEach( (callback) => callback(params) );
    }

}

let actionDispatcherInstance = new ActionDispatcher();
module.exports = actionDispatcherInstance;
