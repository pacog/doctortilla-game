var activeInventory = require('../state/ActiveInventory.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var UIInventoryItem = require('./UIInventoryItem.js');

class UIInventory {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createBG();
        this._items = new Set();
        activeInventory.subscribeToChange((newInventory) => this._inventoryChanged(newInventory))
    }

    refresh() {
        this._inventoryChanged(activeInventory.getActiveInventory());
    }

    _inventoryChanged(newInventory) {
        this._currentInventory = newInventory;
        this._createItems();
    }

    _createBG() {
        let layoutStartPosition = layout.INVENTORY_START_POSITION;

        let background = this.phaserGame.add.sprite(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_INV_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;
    }

    _createItems() {
        //TODO: handle order and more than 6 inv items
        this._destroyPrevItems();
        this._items.clear();
        let index = 0;
        for (let thing of this._currentInventory.items) {
            this._items.add(
                new UIInventoryItem(
                    this.phaserGame,
                    thing,
                    index
                )
            );
            index += 1;
        }
    }

    _destroyPrevItems() {
        this._items.forEach(item => item.destroy());
    }
}
module.exports = UIInventory;