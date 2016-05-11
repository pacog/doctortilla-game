var Thing = require('../engine/Thing.js');

class BackstageDoorToStreet extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 100,
            y: 161,
            spriteId: 'door_sprite'
        };
        super(phaserGame, options);
    }

    get name() {
        return 'street';
    }
}

module.exports = BackstageDoorToStreet;