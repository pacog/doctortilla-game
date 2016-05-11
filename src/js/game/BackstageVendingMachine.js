var Thing = require('../engine/Thing.js');

class BackstageVendingMachine extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 54,
            y: 131,
            spriteId: 'vending',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(phaserGame, options);
    }
}

module.exports = BackstageVendingMachine;