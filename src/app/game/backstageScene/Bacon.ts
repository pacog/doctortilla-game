import { Thing } from '../../engine/models/Thing';

const options = {
    id: 'bacon',
    spriteId: 'BACON',
    inventoryImageId: 'BACON',
    name: 'bacon',
    directlyInInventory: true
}

export class Bacon extends Thing {
    constructor() {
        super(options);
    }
}