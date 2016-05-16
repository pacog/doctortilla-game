var ActionButton = require('./ActionButton.js');
var Verbs = require('./Verbs.js');
var actions = require('./Actions.singleton.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');

class UIVerbs {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createButtons();
        this._listenToEvents();
    }

    _listenToEvents() {
        actionDispatcher.subscribeTo(
            actions.CURSOR_OVER_THING,
            (thing) => this._highlightSecondaryActionForThing(thing)
        );

        actionDispatcher.subscribeTo(
            actions.CURSOR_OUT_THING,
            () => this._removePreviouslyHighlightedAction()
        );
    }

    _highlightSecondaryActionForThing(thing) {
        this._removePreviouslyHighlightedAction();
        this._highlightedAction = thing.getPreferredAction();
        if (this._highlightedAction) {
            this.buttons.get(this._highlightedAction).highlight();
        }
    }

    _removePreviouslyHighlightedAction() {
        if (this._highlightedAction) {
            this.buttons.get(this._highlightedAction).unhighlight();
            this._highlightedAction = null;
        }
    }

    _createButtons() {
        this.buttons = new Map();
        this.buttons.set(
                Verbs.GO_TO,
                new ActionButton(this.phaserGame,
                    Verbs.GO_TO,
                    {x: 0, y: 0}
                )
            );
        this.buttons.set(
                Verbs.LOOK,
                new ActionButton(this.phaserGame,
                    Verbs.LOOK,
                    {x: 0, y: 1}
                )
            );
        this.buttons.set(
                Verbs.GIVE,
                new ActionButton(this.phaserGame,
                    Verbs.GIVE,
                    {x: 0, y: 2}
                )
            );
        this.buttons.set(
                Verbs.PUSH,
                new ActionButton(this.phaserGame,
                    Verbs.PUSH,
                    {x: 1, y: 0}
                )
            );
        this.buttons.set(
                Verbs.TAKE,
                new ActionButton(this.phaserGame,
                    Verbs.TAKE,
                    {x: 1, y: 1}
                )
            );
        this.buttons.set(
                Verbs.USE,
                new ActionButton(this.phaserGame,
                    Verbs.USE,
                    {x: 1, y: 2}
                )
            );
        this.buttons.set(
                Verbs.SPEAK,
                new ActionButton(this.phaserGame,
                    Verbs.SPEAK,
                    {x: 2, y: 0}
                )
            );
        this.buttons.set(
                Verbs.OPEN,
                new ActionButton(this.phaserGame,
                    Verbs.OPEN,
                    {x: 2, y: 1}
                )
            );
        this.buttons.set(
                Verbs.CLOSE,
                new ActionButton(this.phaserGame,
                    Verbs.CLOSE,
                    {x: 2, y: 2}
                )
            );
    }
}

module.exports = UIVerbs;