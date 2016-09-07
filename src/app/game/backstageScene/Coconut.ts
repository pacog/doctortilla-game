import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { costumeCreator } from '../utils/CostumeCreator';

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

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('Does it look like a pair of tits?');
        } else {
            player.say('Compare cómprame un coco');
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (selectedThing.thing.id === 'flowers') {
            costumeCreator.addFlowers(player);
            costumeCreator.addCoconut(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'skirt') {
            costumeCreator.addSkirt(player);
            costumeCreator.addCoconut(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'costume') {
            costumeCreator.addCoconut(player);
            this.destroy();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

}
