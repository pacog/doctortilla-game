import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { costumeCreator } from '../utils/CostumeCreator';
import { randomText } from '../../engine/utils/RandomText';

const options = {
    id: 'coconut',
    x: 92,
    y: 195,
    spriteId: 'COCONUT',
    inventoryImageId: 'COCONUT_INV',
    name: 'COCONUT',
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
            player.say('DOES_IT_LOOK_LIKE_A_PAIR_OF_TITS');
        } else {
            player.say('COMPARE_COMPRAME_UN_COCO');
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
            super.useAction(player);
        }
    }

}
