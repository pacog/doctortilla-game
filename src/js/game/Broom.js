var Thing = require('../engine/models/Thing.js');
var actionDispatcher = require('../engine/ActionDispatcher.singleton.js');
var actions = require('../engine/stores/Actions.store.js');

class Broom extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 254,
            y: 101,
            spriteId: 'broom',
            name: 'broom',
            goToPosition: {
                x: 250,
                y: 175
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        player.say('a broom!');
        player.goToThing(this)
            .then(() => {
                actionDispatcher.execute(actions.TAKE_OBJECT, this);
            });
        
    }

}

module.exports = Broom;