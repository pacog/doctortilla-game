import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { costumeCreator } from '../utils/CostumeCreator';

const options = {
    id: 'flowers',
    x: 127,
    y: 148,
    spriteId: 'FLOWERS',
    inventoryImageId: 'FLOWERS_INV',
    name: 'FLOWERS',
    goToPosition: {
        x: 136,
        y: 178
    },
    pickable: true
};

export class Flowers extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) {
        if (this.isInInventory()) {
            player.say('I_BET_I_COULD_DO_A_BEAUTIFUL_COSTUME_WITH_IT');
        } else {
            player.say('VERY_BEAUTIFUL_FLOWERS');
        }
    }

    protected useAction(player: DoctortillaPlayer) {
        if (selectedThing.thing.id === 'coconut') {
            costumeCreator.addCoconut(player);
            costumeCreator.addFlowers(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'skirt') {
            costumeCreator.addSkirt(player);
            costumeCreator.addFlowers(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'costume') {
            costumeCreator.addFlowers(player);
            this.destroy();
        } else {
            super.useAction(player);
        }
    }

}
