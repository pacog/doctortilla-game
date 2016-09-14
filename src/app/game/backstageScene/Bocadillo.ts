import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Bread } from './Bread';
import { Bacon } from './Bacon';

const options = {
    id: 'bocadillo',
    x: 705,
    y: 145,
    spriteId: 'BOCADILLO',
    inventoryImageId: 'BOCADILLO_INV',
    name: 'BOCADILLO',
    goToPosition: {
        x: 692,
        y: 190
    },
    pickable: true
}

export class Bocadillo extends Thing {
    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('I_THINK_I_CAN_OPEN_IT_AND_TAKE_THE_BACON');
        } else {
            player.say('A_RANCID_AND_GREASY_SANDWHICH');
        }
    }

    protected openAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            new Bacon();
            new Bread();
            this.destroy();
        } else {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
        }
    }

}
