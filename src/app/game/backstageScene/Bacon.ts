import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';

const options = {
    id: 'bacon',
    spriteId: 'BACON',
    inventoryImageId: 'BACON_INV',
    name: 'bacon',
    directlyInInventory: true
}

export class Bacon extends Thing {
    constructor() {
        super(options);
    }

    lookAction(player: Player): void {
        player.say('Delicious and GREASY!');
    }
}