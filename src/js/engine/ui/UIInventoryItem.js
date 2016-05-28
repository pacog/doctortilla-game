var layout = require('./LayoutManager.singleton.js');
var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');

class UIInventoryItem {
    constructor(phaserGame, thing, index) {
        this.phaserGame = phaserGame;
        this.thing = thing;
        this.index = index;
        this._createSprite();
    }

    _createSprite() {
        this._position = layout.getPositionForUIInventoryItem(this.index);
        this.sprite = this.phaserGame.add.sprite(
            this._position.x,
            this._position.y,
            this.thing.inventoryImage
        );

        this.sprite.inputEnabled = true;
        this.sprite.fixedToCamera = true;

        this.sprite.events.onInputDown.add(this._onClick, this);
        this.sprite.events.onInputOver.add(this._onInputOver, this);
        this.sprite.events.onInputOut.add(this._onInputOut, this);
    }

    _onClick() {
        actionDispatcher.execute(actions.SELECT_THING, this.thing);
    }

    _onInputOver() {
        actionDispatcher.execute(actions.CURSOR_OVER_THING, this.thing);
    }

    _onInputOut() {
        actionDispatcher.execute(actions.CURSOR_OUT_THING, this.thing);
    }

    destroy() {
        this.sprite.destroy();
    }

}
module.exports = UIInventoryItem;