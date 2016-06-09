var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

class Scissors extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'scissors',
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

    useAction(player) {
        if (selectedThing.thing.id === 'broom') {
            let broom = selectedThing.thing;
            broom.cutWithScissors();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Scissors);

module.exports = Scissors;