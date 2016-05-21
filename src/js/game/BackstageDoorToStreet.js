var Door = require('../engine/models/Door.js');
var scenes = require('./Scenes.store.js');
var doors = require('./Doors.store.js');

class BackstageDoorToStreet extends Door {
    constructor(phaserGame, state) {
        let options = {
            id: doors.BACKSTAGE_TO_BACKYARD,
            x: 150,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 175,
                y: 165
            },
            destination: scenes.BACKYARD,
            relatedDoor: doors.BACKYARD_TO_BACKSTAGE
        };
        super(phaserGame, options, state);
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