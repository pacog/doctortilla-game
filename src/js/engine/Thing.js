var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');

class Thing {

    constructor(phaserGame, options) {
        this.options = options;
        this.phaserGame = phaserGame;
        this._createSprite();
    }

    get name() {
        return this.options.name || 'thing';
    }

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