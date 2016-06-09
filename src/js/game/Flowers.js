var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');
var Costume = require('./Costume.js');

class Flowers extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'flowers',
            x: 104,
            y: 161,
            spriteId: 'flowers',
            inventoryImageId: 'flowers',
            name: 'flowers',
            goToPosition: {
                x: 120,
                y: 185
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        player.say('Let\'s kill the flowers!');
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('I bet I could do a beautiful costume with this');
        } else {
            player.say('Nice flowers');
        }
    }

    useAction(player) {
        if (selectedThing.thing.id === 'coconut') {
            this.createCostumeFromCoconut(player, selectedThing.thing);
        } else if (selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, selectedThing.thing);
        } else if (selectedThing.thing.id === 'costume') {
            this.addFlowersToCostume(player, selectedThing.thing);
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    createCostumeFromCoconut(player, coconut) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume(this.phaserGame);
        costume.addCoconut(coconut);
        costume.addFlowers(this);
    }

    createCostumeFromSkirt(player, skirt) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume(this.phaserGame);
        costume.addSkirt(skirt);
        costume.addFlowers(this);
    }

    addFlowersToCostume(player, costume) {
        costume.addFlowers(this);
    }

}

compositionFactory.applyModifier(PickableModifier, Flowers);

module.exports = Flowers;