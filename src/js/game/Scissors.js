var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class Scissors extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 142,
            y: 165,
            spriteId: 'scissors',
            inventoryImageId: 'scissors',
            name: 'scissors',
            goToPosition: {
                x: 172,
                y: 205
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Shiny and sharp!');
        } else {
            player.say('Not safe having scissors around musicians');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Scissors);

module.exports = Scissors;