import { Thing } from '../../engine/models/Thing';

const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD',
    name: 'bread',
    directlyInInventory: true
}

export class Bread extends Thing {
    constructor() {
        super(options);
    }
}