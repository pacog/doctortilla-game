import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';

const options = {
    id: 'bread',
    spriteId: 'BREAD',
    inventoryImageId: 'BREAD_INV',
    name: 'bread',
    directlyInInventory: true
}

export class Bread extends Thing {
    constructor() {
        super(options);
    }

    lookAction(player: Player): void {
        player.say('Todo lo que termina, termina mal.')
            .then(() => {
                return player.say('Poco a poco.')
            })
            .then(() => {
                return player.say('Y si no termina, se contamina.')
            })
            .then(() => {
                return player.say('Y eso se cubre de polvo.')
            });
    }
}