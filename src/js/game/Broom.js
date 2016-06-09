var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var Skirt = require('./Skirt.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

class Broom extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'broom',
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
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Awesome, now I have a broom');
        } else {
            player.say('Si yo tuviera una escoba...');
        }
    }

    useAction(player) {
        if (selectedThing.thing.id === 'scissors') {
            this.cutWithScissors();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    cutWithScissors() {
        new Skirt(this.phaserGame);
        this.destroy();
    }

}

compositionFactory.applyModifier(PickableModifier, Broom);

module.exports = Broom;