import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';

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

    lookAction(player: Player): void  {
        player.say('I\'m not exactly rich, but it\'s a start!');
    }


}
