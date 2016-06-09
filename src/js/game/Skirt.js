var Thing = require('../engine/models/Thing.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

class Skirt extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'skirt',
            spriteId: 'skirt',
            inventoryImageId: 'skirt',
            name: 'skirt',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

    lookAction(player) {
        player.say('I am sensing some costume here');
    }

    useAction(player) {
        if (selectedThing.thing.id === 'flowers') {
            let flowers = selectedThing.thing;
            flowers.createCostumeFromSkirt(player, this);
        } else if (selectedThing.thing.id === 'coconut') {
            let coconut = selectedThing.thing;
            coconut.createCostumeFromSkirt(player, this);
        } else if (selectedThing.thing.id === 'costume') {
            this.addSkirtToCostume(player, selectedThing.thing);
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    addSkirtToCostume(player, costume) {
        costume.addSkirt(this);
    }

}

module.exports = Skirt;