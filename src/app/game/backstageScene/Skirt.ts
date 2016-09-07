import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { costumeCreator } from '../utils/CostumeCreator';

const options = {
    id: 'skirt',
    spriteId: 'skirt',
    inventoryImageId: 'SKIRT',
    name: 'skirt',
    directlyInInventory: true
};

export class Skirt extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer): void {
        player.say('I am sensing some costume here');
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (selectedThing.thing.id === 'flowers') {
            costumeCreator.addSkirt(player);
            costumeCreator.addFlowers(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'coconut') {
            costumeCreator.addSkirt(player);
            costumeCreator.addCoconut(player);
            selectedThing.thing.destroy();
            this.destroy();
        } else if (selectedThing.thing.id === 'costume') {
            costumeCreator.addSkirt(player);
            this.destroy();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

}
