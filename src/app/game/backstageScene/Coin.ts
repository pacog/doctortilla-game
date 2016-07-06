import { Thing } from '../../engine/models/Thing';

export class Coin extends Thing {
    constructor() {
        let options = {
            id: 'coin',
            spriteId: 'coin',
            inventoryImageId: 'coin',
            name: 'coin',
            directlyInInventory: true
        };
        super(options);
    }

}
