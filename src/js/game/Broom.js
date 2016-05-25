var Thing = require('../engine/models/Thing.js');
var actionDispatcher = require('../engine/ActionDispatcher.singleton.js');
var actions = require('../engine/stores/Actions.store.js');

class Broom extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 254,
            y: 101,
            spriteId: 'broom',
            inventoryImageId: 'broom_inv',
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

    
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Awesome, now I have a broom');
        } else {
            player.say('Si yo tuviera una escoba...');
        }
    }

}

module.exports = Broom;