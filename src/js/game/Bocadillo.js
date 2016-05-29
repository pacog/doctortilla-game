var Thing = require('../engine/models/Thing.js');
var Bacon = require('./Bacon.js');
var Bread = require('./Bread.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

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
        this._getTakenBy(player);
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
compositionFactory.applyModifier(PickableModifier, Bocadillo);

module.exports = Bocadillo;