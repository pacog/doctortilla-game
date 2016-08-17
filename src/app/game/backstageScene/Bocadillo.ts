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
    name: 'bocadillo',
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
            player.say('I think I can open it and take the bacon');
        } else {
            player.say('A rancid and GREASY sandwhich');
        }
    }

    protected openAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            new Bacon();
            new Bread();
            this.destroy();
        } else {
            player.say('I have to pick it up first');
        }
    }

}
