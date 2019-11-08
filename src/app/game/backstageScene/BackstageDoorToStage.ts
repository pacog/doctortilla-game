import { Door } from '../../engine/models/Door';
import { Player } from '../../engine/models/Player';
import { Directions } from '../../engine/utils/Directions';
import { randomText } from '../../engine/utils/RandomText';

let options = {
    id: 'backstage_door_to_stage',
    x: 330,
    y: 67,
    spriteId: 'BACKSTAGE_DOOR_TO_STAGE_SPRITE',
    name: 'DOOR_TO_STAGE',
    goToPosition: {
        x: 378,
        y: 163
    },
    destinationSceneId: 'KITCHEN',
    relatedDoorId: 'STAGE_TO_BACKSTAGE'
};

export class BackstageDoorToStage extends Door {
    constructor() {
        super(options);
    }

    openAction(player: Player): void  {
        /**/ this.changeAttr('CANGO', true);
        if (!this.getAttr('CANGO'))
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

    protected pushAction(player: Player): void  {
        if (!this.getAttr('CANGO'))
        {
            player.lookAt(Directions.DOWN);
            player.say('NOPE_I_CANNOT_GO_TO_THE_STAGE')
                .then(() => {
                    return player.say('FIRST_I_NEED_TO_GET_THE_BAND_READY');
                });
        }
    }

    protected speakAction(player: Player): void  {
        player.say(randomText(
            'HI_DOOR_HOW_ARE_YOU_TODAY',
            'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME',
            'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'
        ));
    }

    lookAction(player: Player): void  {
        player.say(randomText(
            'NICE_SAFE_DOOR',
            'MADE_OF_METAL_RUST_AND_STICKY_STUFF',
            'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US'
        ));
    }

}
