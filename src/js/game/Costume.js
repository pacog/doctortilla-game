var Thing = require('../engine/models/Thing.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

const FULL_FRAME = 3;
const FLOWER_AND_COCONUT_FRAME = 1;
const FLOWER_AND_SKIRT_FRAME = 2;
const SKIRT_AND_COCONUT_FRAME = 0;


class Glass extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'costume',
            x: 137,
            y: 130,
            spriteId: 'COSTUME_SPRITE',
            inventoryImageId: 'COSTUME_SPRITE',
            name: 'costume',
            directlyInInventory: true
        };
        super(phaserGame, options);
    }

    useAction(player) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'coconut') {
            this.addCoconut(selectedThing.thing);
        } else if (selectedThing.thing.id === 'flowers') {
            this.addFlowers(selectedThing.thing);
        } else if (selectedThing.thing.id === 'skirt') {
            this.addSkirt(selectedThing.thing);
        } else {
            player.say('I don\t know how to do that...');
        }
    }

    lookAction(player) {
        //TODO: check different states
        player.say('Almost done!');
    }

    getFrameForInventory() {
        if (this.isComplete()) {
            return FULL_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_SKIRT')) {
            return SKIRT_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_SKIRT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_SKIRT_FRAME;
        }
        return FULL_FRAME;
    }

    addCoconut(coconut) {
        this.changeAttr('HAS_COCONUT', true);
        coconut.destroy();
    }

    addFlowers(flowers) {
        this.changeAttr('HAS_FLOWERS', true);
        flowers.destroy();
    }

    addSkirt(skirt) {
        this.changeAttr('HAS_SKIRT', true);
        skirt.destroy();
    }

    isComplete() {
        return this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS') && this.getAttr('HAS_SKIRT');
    }

}

module.exports = Glass;