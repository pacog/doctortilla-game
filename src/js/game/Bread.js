var Thing = require('../engine/models/Thing.js');
// var actionDispatcher = require('../engine/ActionDispatcher.singleton.js');
// var actions = require('../engine/stores/Actions.store.js');

class Bread extends Thing {
    constructor(phaserGame) {
        let options = {
            spriteId: 'pan',
            inventoryImageId: 'pan',
            name: 'bread',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

}

module.exports = Bread;