import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Glass } from './Glass';

const options = {
    id: 'dust',
    x: 247,
    y: 128,
    spriteId: 'DUST',
    inventoryImageId: 'DUST_INV',
    name: 'dust',
    goToPosition: {
        x: 248,
        y: 177
    },
    pickable: true
};

export class Dust extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('I bet this "dust" can make "somebody" less shy');
        } else {
            player.say('That\'s some highly suspicious white powder');
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'glass') {
            let glass = <Glass> selectedThing.thing;
            glass.fillWithDust(player, this);
        } else if (selectedThing.thing.id === 'can') {
            player.say('I should probably mix it in a glass');
        } else {
            player.say('I don\t know how to do that...');
        }
    }

}