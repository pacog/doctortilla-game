var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class Glass extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 137,
            y: 130,
            spriteId: 'glass',
            inventoryImageId: 'glass',
            name: 'glass',
            goToPosition: {
                x: 167,
                y: 180
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Really useful to put liquids or other substances inside');
        } else {
            player.say('It is indeed a glass');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Glass);

module.exports = Glass;