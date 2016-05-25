var Thing = require('../engine/models/Thing.js');
var actionDispatcher = require('../engine/ActionDispatcher.singleton.js');
var actions = require('../engine/stores/Actions.store.js');
var Bacon = require('./Bacon.js');
var Bread = require('./Bread.js');

class Bocadillo extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 354,
            y: 151,
            spriteId: 'bocadillo',
            inventoryImageId: 'bocadillo',
            name: 'bocadillo',
            goToPosition: {
                x: 334,
                y: 181
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        player.say('quiero mi bo-cadillo!');
        player.goToThing(this)
            .then(() => {
                actionDispatcher.execute(actions.TAKE_OBJECT, this);
            });
        
    }

    
    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I think I can open it and take the bacon');
        } else {
            player.say('A rancid and GREASY sandwhich');
        }
    }

    openAction(player) {
        if (this.isInInventory()) {
            new Bacon(this.phaserGame);
            new Bread(this.phaserGame);
            this.destroy();
        } else {
            player.say('I have to pick it up first, dont I?');
        }
    }

}

module.exports = Bocadillo;