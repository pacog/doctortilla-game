import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';

const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD_INV',
    name: 'BREAD',
    directlyInInventory: true
}

export class Bread extends Thing {
    constructor() {
        super(options);
    }

    lookAction(player: Player): void {
        player.say('BREAD_LEFTOVERS_NOT_USEFUL');
    }
}