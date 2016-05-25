var actions = require('../stores/Actions.store.js');
var actionDispatcher = require('../ActionDispatcher.singleton.js');

class GenericHighlightedThing {
    constructor() {
        this._subscribers = new Set();
        this.reset();

        actionDispatcher.subscribeTo(
            actions.CURSOR_OVER_THING,
            thing => this._onCursorOverThing(thing)
        );

        actionDispatcher.subscribeTo(
            actions.CURSOR_OUT_THING,
            thing => this._onCursorOutThing(thing)
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

    _onCursorOverThing() {
    }

    _onCursorOutThing() {
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

    set thing(newThing) {
        this._highlightThing(newThing);
    }
}
module.exports = GenericHighlightedThing;