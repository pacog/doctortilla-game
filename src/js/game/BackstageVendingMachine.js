var Thing = require('../engine/Thing.js');

class BackstageVendingMachine extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 70,
            y: 181,
            spriteId: 'vending',
            name: 'vending machine'
        };
        super(phaserGame, options);
    }
}

module.exports = BackstageVendingMachine;