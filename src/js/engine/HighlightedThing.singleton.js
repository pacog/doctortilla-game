var actions = require('./Actions.singleton.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');

class HighlightedThing {
    constructor() {
        this._subscribers = new Set();
        this.reset();

        actionDispatcher.subscribeTo(
            actions.CURSOR_OVER_THING,
            thing => this._highlightThing(thing)
        );

        actionDispatcher.subscribeTo(
            actions.CURSOR_OUT_THING,
            thing => this._highlightThing(null)
        );
    }

    reset() {
        this._highlightThing(null);
    }

    subscribeToChange(callback) {
        this._subscribers.add(callback);
        callback(this._highlightedThing);
    }

    unsubscribeToChange(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._highlightedThing));
    }

    _highlightThing(newThing) {
        this._highlightedThing = newThing;
        this._notifySubscribers();
    }

    get thing() {
        return this._highlightedThing;
    }

}

var highlightedThing = new HighlightedThing();
module.exports = highlightedThing;