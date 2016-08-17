import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'bacsktage_door_to_street',
    x: 59,
    y: 100,
    spriteId: 'BACKSTAGE_DOOR_TO_STREET',
    name: 'door to street',
    goToPosition: {
        x: 101,
        y: 185
    }
};

export class BackstageDoorToStreet extends Thing {
    constructor() {
        super(options);
    }

    protected openAction(player: Player): void  {
        player.lookAt(Directions.DOWN);
        player.say('Nope, I can not go to the street')
            .then(() => {
                return player.say('We have a concert to play!');
            });
    }
}
