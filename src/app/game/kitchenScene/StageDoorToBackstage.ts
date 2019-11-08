import { Door } from '../../engine/models/Door';
import { Player } from '../../engine/models/Player';

export class StageDoorToBackstage extends Door {
    constructor() {
        let options = {
            id: 'STAGE_TO_BACKSTAGE',
            name: 'DOOR_TO_BACKSTAGE',
            x: 27,
            y: 92,
            spriteId: 'STAGE_DOOR_TO_BACKSTAGE_SPRITE',
            goToPosition: {
                x: 62,
                y: 209
            },
            destinationSceneId: 'BACKSTAGE',
            relatedDoorId: 'backstage_door_to_stage'
        };
        super(options);
    }

    protected takeAction(player: Player): void  {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }
   
    public lookAction(player: Player): void  {
        player.say('WAY_BACK_TO_BACKSTAGE');
    }
}