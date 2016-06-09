var Thing = require('../engine/models/Thing.js');

class Can extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'can',
            spriteId: 'can',
            inventoryImageId: 'can',
            name: 'can',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

}

module.exports = Can;