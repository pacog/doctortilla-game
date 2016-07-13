import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from './Costume';
import { Coconut } from './Coconut';
import { Flowers } from '../backyardScene/Flowers';

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
            let flowers = <Flowers> selectedThing.thing;
            flowers.createCostumeFromSkirt(player, this);
        } else if (selectedThing.thing.id === 'coconut') {
            let coconut = <Coconut> selectedThing.thing;
            coconut.createCostumeFromSkirt(player, this);
        } else if (selectedThing.thing.id === 'costume') {
            this.addSkirtToCostume(player, <Costume> selectedThing.thing);
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    addSkirtToCostume(player: DoctortillaPlayer, costume: Costume): void {
        costume.addSkirt(this);
    }

}
