import { Inventory } from './Inventory';

export abstract class Player {

    inventory: Inventory;

    constructor() {
        this.inventory = new Inventory();
    }

}