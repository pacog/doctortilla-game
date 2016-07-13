import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from '../backstageScene/Costume';
import { Skirt } from '../backstageScene/Skirt';
import { Coconut } from '../backstageScene/Coconut';

const options = {
    id: 'flowers',
    x: 104,
    y: 161,
    spriteId: 'FLOWERS',
    inventoryImageId: 'FLOWERS',
    name: 'flowers',
    goToPosition: {
        x: 120,
        y: 185
    },
    pickable: true
};

export class Flowers extends Thing {

    constructor() {
        super(options);
    }

    createCostumeFromCoconut(player: DoctortillaPlayer, coconut: Coconut) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume();
        costume.addCoconut(coconut);
        costume.addFlowers(this);
    }

    protected lookAction(player: DoctortillaPlayer) {
        if (this.isInInventory()) {
            player.say('I bet I could do a beautiful costume with this');
        } else {
            player.say('Nice flowers');
        }
    }

    protected useAction(player: DoctortillaPlayer) {
        if (selectedThing.thing.id === 'coconut') {
            this.createCostumeFromCoconut(player, <Coconut> selectedThing.thing);
        } else if (selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, <Skirt> selectedThing.thing);
        } else if (selectedThing.thing.id === 'costume') {
            this.addFlowersToCostume(player, <Costume> selectedThing.thing);
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
        costume.addFlowers(this);
    }

    private addFlowersToCostume(player: DoctortillaPlayer, costume: Costume) {
        costume.addFlowers(this);
    }

}
