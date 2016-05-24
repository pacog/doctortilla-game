var activeInventory = require('../state/ActiveInventory.singleton.js');

class UIInventory {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        
        activeInventory.subscribeToChange((newInventory) => this._inventoryChanged(newInventory))
    }

    _inventoryChanged(newInventory) {
        console.log('new inventory');
        console.log(newInventory);
    }
}
module.exports = UIInventory;