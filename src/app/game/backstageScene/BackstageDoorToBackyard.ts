import { Door } from '../../engine/models/Door';
import { Player } from '../../engine/models/Player';
import { randomText } from '../../engine/utils/RandomText';

export class BackstageDoorToBackyard extends Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'DOOR_TO_BACKYARD',
            x: 739,
            y: 111,
            spriteId: 'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE',
            goToPosition: {
                x: 743,
                y: 210
            },
            destinationSceneId: 'BACKYARD',
            relatedDoorId: 'BACKYARD_TO_BACKSTAGE'
        };
        super(options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'BACKYARD';
        } else {
            return 'DOOR_TO_BACKYARD';
        }
    }

    protected takeAction(player: Player): void  {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }

    protected speakAction(player: Player): void  {
        player.say(randomText(
            'HI_DOOR_HOW_ARE_YOU_TODAY',
            'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME',
            'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'
        ));
    }

    public lookAction(player: Player): void  {
        player.say('BILI_MUST_BE_OUT_THERE_SMOKING');
    }
}