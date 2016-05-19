var Door = require('../engine/Door.js');
var scenes = require('./Scenes.js');
var doors = require('./Doors.store.js');

class BackyardDoorToBackstage extends Door {
    constructor(phaserGame) {
        let options = {
            id: doors.BACKYARD_TO_BACKSTAGE,
            x: 200,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 225,
                y: 165
            },
            destination: scenes.BACKSTAGE,
            relatedDoor: doors.BACKSTAGE_TO_BACKYARD
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