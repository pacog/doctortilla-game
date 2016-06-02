var Thing = require('../engine/models/Thing.js');
// var actionDispatcher = require('../engine/ActionDispatcher.singleton.js');
// var actions = require('../engine/stores/Actions.store.js');

class Bacon extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'bacon',
            spriteId: 'panceta',
            inventoryImageId: 'panceta',
            name: 'bacon',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

}

module.exports = Bacon;