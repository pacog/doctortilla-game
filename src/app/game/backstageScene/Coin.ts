import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';

export class Coin extends Thing {
    constructor() {
        let options = {
            id: 'coin',
            inventoryImageId: 'COIN_INV',
            name: 'COIN',
            directlyInInventory: true
        };
        super(options);
    }

    lookAction(player: Player): void  {
        player.say('I_AM_NOT_RICH_BUT_IT_IS_A_START');
    }

}
