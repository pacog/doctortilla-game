import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from '../backstageScene/Costume';
import { Skirt } from '../backstageScene/Skirt';
import { Flowers } from '../backyardScene/Flowers';

const options = {
    id: 'coconut',
    x: 92,
    y: 195,
    spriteId: 'COCONUT',
    inventoryImageId: 'COCONUT_INV',
    name: 'coconut',
    goToPosition: {
        x: 110,
        y: 203
    },
    pickable: true,
    isForeground: true
};

export class Coconut extends Thing {

    constructor() {
        super(options);
    }

    createCostumeFromSkirt(player: DoctortillaPlayer, skirt: Skirt): void {
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

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('Does it look like a pair of tits?');
        } else {
            player.say('Compare cómprame un coco');
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
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

}
