var Door = require('../engine/Door.js');
var scenes = require('./Scenes.js');

class BackyardDoorToBackstage extends Door {
    constructor(phaserGame) {
        let options = {
            x: 200,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 175,
                y: 165
            },
            destination: scenes.BACKSTAGE
        };
        super(phaserGame, options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'backstage';
        } else {
            return 'door to backstage';
        }
    }
}

module.exports = BackyardDoorToBackstage;