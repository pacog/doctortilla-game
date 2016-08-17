import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'backstage_door_to_stage',
    x: 330,
    y: 67,
    spriteId: 'BACKSTAGE_DOOR_TO_STAGE',
    name: 'door to stage',
    goToPosition: {
        x: 378,
        y: 163
    }
};

export class BackstageDoorToStage extends Thing {
    constructor() {
        super(options);
    }

    protected openAction(player: Player): void  {
        player.lookAt(Directions.DOWN);
        player.say('I can\'t go to the stage yet')
            .then(() => {
                return player.say('I first have to get the band ready');
            });
    }
}
