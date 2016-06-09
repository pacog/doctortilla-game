var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class Coconut extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 120,
            y: 130,
            spriteId: 'coconut',
            inventoryImageId: 'coconut',
            name: 'coconut',
            goToPosition: {
                x: 150,
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
            player.say('Does it look like a pair of tits?');
        } else {
            player.say('Compare cómprame un coco');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Coconut);

module.exports = Coconut;