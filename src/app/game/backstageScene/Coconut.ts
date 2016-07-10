import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from '../backstageScene/Costume';
import { Skirt } from '../backstageScene/Skirt';
import { Flowers } from '../backyardScene/Flowers';

const options = {
    id: 'coconut',
    x: 120,
    y: 130,
    spriteId: 'COCONUT',
    inventoryImageId: 'COCONUT',
    name: 'coconut',
    goToPosition: {
        x: 150,
        y: 180
    },
    pickable: true
};

export class Coconut extends Thing {

    constructor() {
        super(options);
    }

    lookAction(player: DoctortillaPlayer) {
        if (this.isInInventory()) {
            player.say('Does it look like a pair of tits?');
        } else {
            player.say('Compare cómprame un coco');
        }
    }

    useAction(player: DoctortillaPlayer) {
        if (selectedThing.thing.id === 'flowers') {
            let flowers = <Flowers> selectedThing.thing;
            flowers.createCostumeFromCoconut(player, this);
        } else if (selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, <Skirt> selectedThing.thing);
        } else if (selectedThing.thing.id === 'costume') {
            this.addCoconutToCostume(player, <Costume> selectedThing.thing);
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    createCostumeFromSkirt(player: DoctortillaPlayer, skirt: Skirt) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume();
        costume.addSkirt(skirt);
        costume.addCoconut(this);
    }

    addCoconutToCostume(player: DoctortillaPlayer, costume: Costume) {
        costume.addCoconut(this);
    }

}
