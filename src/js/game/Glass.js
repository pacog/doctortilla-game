var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');
var activeInventory = require('../engine/state/ActiveInventory.singleton.js');

const NORMAL_FRAME = 0;
const POWDER_FRAME = 1;
const FILLED_FRAME = 2;
const POWDER_FILLED_FRAME = 3;

class Glass extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'glass',
            x: 137,
            y: 130,
            spriteId: 'GLASS_SPRITE',
            inventoryImageId: 'GLASS_SPRITE',
            name: 'glass',
            goToPosition: {
                x: 167,
                y: 180
            }
        };
        super(phaserGame, options);
    }

    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'dust') {
            this.fillWithDust(player, selectedThing.thing);

        } else if (selectedThing.thing.id === 'can') {
            this.fillWithDrink(player, selectedThing.thing);
        } else {
            player.say('I don\t know how to do that...');
        }
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

    fillWithDust(player, dust) {
        this.changeAttr('POWDER_INSIDE', true);
        dust.destroy();
    }

    fillWithDrink(player) {
        if (!this.getAttr('FILLED')) {
            this.changeAttr('FILLED', true);
            activeInventory.refresh();
        } else {
            player.say('It is already full');
        }
    }

    getFrameForInventory() {
        if (this.getAttr('FILLED')) {
            if (this.getAttr('POWDER_INSIDE')) {
                return POWDER_FILLED_FRAME;
            } else {
                return FILLED_FRAME;
            }
        } else if (this.getAttr('POWDER_INSIDE')) {
            return POWDER_FRAME;
        }

        return NORMAL_FRAME;
    }

}

compositionFactory.applyModifier(PickableModifier, Glass);

module.exports = Glass;