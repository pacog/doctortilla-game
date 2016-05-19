var Door = require('../engine/Door.js');
var scenes = require('./Scenes.js');

class BackstageDoorToStreet extends Door {
    constructor(phaserGame) {
        let options = {
            x: 150,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 175,
                y: 165
            },
            destination: scenes.BACKYARD
        };
        super(phaserGame, options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'street';
        } else {
            return 'door to street';
        }
    }
}

module.exports = BackstageDoorToStreet;