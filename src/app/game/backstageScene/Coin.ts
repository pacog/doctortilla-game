import { Thing } from '../../engine/models/Thing';

export class Coin extends Thing {
    constructor() {
        let options = {
            id: 'coin',
            inventoryImageId: 'COIN_INV',
            name: 'coin',
            directlyInInventory: true
        };
        super(options);
    }

}
