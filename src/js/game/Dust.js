var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

class Dust extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'dust',
            x: 102,
            y: 135,
            spriteId: 'dust',
            inventoryImageId: 'dust',
            name: 'dust',
            goToPosition: {
                x: 132,
                y: 185
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I bet this "dust" can make "somebody" less shy');
        } else {
            player.say('That\'s some highly suspicious white powder');
        }
    }

    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'glass') {
            let glass = selectedThing.thing;
            glass.fillWithDust(player, this);
        } else if (selectedThing.thing.id === 'can') {
            player.say('I should probably mix it in a glass');
        } else {
            player.say('I don\t know how to do that...');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Dust);

module.exports = Dust;