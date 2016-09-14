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
    name: 'SUSPICIOUS_DUST',
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
            player.say('I_BET_THIS_DUST_CAN_MAKE_SOMEBODY_LESS_SHY');
        } else {
            player.say('THAT_S_SOME_HIGHLY_SUSPICIOUS_WHITE_POWDER');
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (!this.isInInventory()) {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
            return;
        }
        if (selectedThing.thing.id === 'glass') {
            let glass = <Glass> selectedThing.thing;
            glass.fillWithDust(player, this);
        } else if (selectedThing.thing.id === 'can') {
            player.say('I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS');
        } else {
            super.useAction(player);
        }
    }

}