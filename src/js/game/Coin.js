var Thing = require('../engine/models/Thing.js');

class Coin extends Thing {
    constructor(phaserGame) {
        let options = {
            spriteId: 'coin',
            inventoryImageId: 'coin',
            name: 'coin',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

}

module.exports = Coin;