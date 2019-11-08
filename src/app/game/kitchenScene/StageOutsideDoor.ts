import { Door } from '../../engine/models/Door';
import { Player } from '../../engine/models/Player';
import { Directions } from '../../engine/utils/Directions';

export class StageOutsideDoor extends Door {
    constructor() {
        let options = {
            id: 'STAGE_TO_OUTSIDE_DOOR',
            name: 'OUTSIDE_DOOR',
            x: 587,
            y: 92,
            spriteId: 'STAGE_TO_OUTSIDE_DOOR_SPRITE',
            goToPosition: {
                x: 570,
                y: 209
            },
            destinationSceneId: 'BACKSTAGE',
            relatedDoorId: 'backstage_door_to_stage'
        };
        super(options);
    }

    openAction(player: Player): void  {
        if (!this.getAttr('OPENED'))
        {
            player.lookAt(Directions.DOWN);
            player.say('NOPE_I_CANNOT_GO_TO_THE_STAGE')
                .then(() => {
                    return player.say('FIRST_I_NEED_TO_GET_THE_BAND_READY');
                });
        }   else {
            super.openAction(player);
        }
    }

    protected takeAction(player: Player): void  {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }

    public lookAction(player: Player): void  {
        player.say('BILI_MUST_BE_OUT_THERE_SMOKING');
    }
}