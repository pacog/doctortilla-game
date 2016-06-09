var Thing = require('../engine/models/Thing.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

class Can extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'can',
            spriteId: 'can',
            inventoryImageId: 'can',
            name: 'can',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

    useAction(player) {
        if (selectedThing.thing.id === 'glass') {
            let glass = selectedThing.thing;
            glass.fillWithDrink(player, this);
        } else if (selectedThing.thing.id === 'dust') {
            player.say('I should probably mix it in a glass');
        } else {
            player.say('I don\t know how to do that...');
        }
    }

}

module.exports = Can;