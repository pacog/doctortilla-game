var verbs = require('./Verbs.js');
var actions = require('./Actions.singleton.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');

class SelectedVerb {
    constructor() {
        this._subscribers = new Set();
        this.reset();
        actionDispatcher.subscribeTo(
            actions.SELECT_VERB,
            newVerb => this._selectNewVerb(newVerb)
        );
        actionDispatcher.subscribeTo(
            actions.ACTION_APPLIED,
            () => this.reset()
        );
    }

    reset() {
        this._selectNewVerb(verbs.GO_TO);
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
        callback(this._selectedVerb);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._selectedVerb));
    }

    _selectNewVerb(newVerb) {
        this._selectedVerb = newVerb;
        this._notifySubscribers();
    }

    get verb() {
        return this._selectedVerb;
    }

}

var selectedVerb = new SelectedVerb();
module.exports = selectedVerb;