var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var currentScene = require('../engine/state/CurrentScene.singleton.js');

class Cable extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 42,
            y: 165,
            spriteId: 'CABLE_SPRITE',
            inventoryImageId: 'CABLE_SPRITE',
            name: 'cable',
            goToPosition: {
                x: 72,
                y: 205
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        player.goToThing(this).then(() => {
            let vendingMachine = currentScene.value.getThingById('vending');
            if (!vendingMachine) {
                throw 'ERROR: vending machine should be present in current scene';
            }

            if (vendingMachine.getAttr('PUSHED')) {
                player.say('Finally, I have the $%# cable!');
                this._getTakenBy(player);
            } else {
                player.say('It is stuck behind the vending machine, I need to move it somehow.');
            }
        });
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Cool, now I should give that to the guys');
        } else {
            player.say('This is the cable I need!');
        }
    }

}

compositionFactory.applyModifier(PickableModifier, Cable);

module.exports = Cable;