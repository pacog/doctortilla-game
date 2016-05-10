var Thing = require('../engine/Thing.js');

class BackstageVendingMachine extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 70,
            y: 181,
            spriteId: 'vending'
        };
        super(phaserGame, options);
    }
}

module.exports = BackstageVendingMachine;