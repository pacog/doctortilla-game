var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');
var Verbs = require('./Verbs.js');

class Thing {

    constructor(phaserGame, options) {
        this.options = options;
        this.phaserGame = phaserGame;
        this._createSprite();
        this._state = new Map();
    }

    get name() {
        return this.options.name || 'thing';
    }

    applyAction(verb, player) {

        switch (verb) {

        case Verbs.GO_TO:
            player.goToThing(this);
            break;
        default:
            //TODO: depending on the verb, do one thing or another
            player.say('I cannot do that');
            break;

        }
        
    }

    getPositionToGoTo() {
        if (this.options.goToPosition) {
            return this.options.goToPosition();
        } else {
            return {
                x: this.options.x,
                y: this.options.y
            };
        }
    }

    changeAttr(attrName, value) {
        this._state.set(attrName, value);
        this._onStateChange();
    }

    getAttr(attrName) {
        return this._state.get(attrName);
    }

    _onStateChange() {}

    _createSprite() {

        this.sprite = this.phaserGame.add.sprite(
                        this.options.x,
                        this.options.y,
                        this.options.spriteId
                      );

        this.sprite.inputEnabled = true;

        this.sprite.events.onInputDown.add(this._onClick, this);
        this.sprite.events.onInputOver.add(this._onInputOver, this);
        this.sprite.events.onInputOut.add(this._onInputOut, this);
    }

    _onClick() {
        actionDispatcher.execute(actions.SELECT_THING, this);
    }

    _onInputOver() {
        actionDispatcher.execute(actions.CURSOR_OVER_THING, this);
    }

    _onInputOut() {
        actionDispatcher.execute(actions.CURSOR_OUT_THING, this);
    }
}

module.exports = Thing;