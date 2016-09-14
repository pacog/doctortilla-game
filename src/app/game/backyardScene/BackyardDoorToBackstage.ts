import { Door } from '../../engine/models/Door';
import { Player } from '../../engine/models/Player';
import { randomText } from '../../engine/utils/RandomText';

export class BackyardDoorToBackstage extends Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'DOOR_TO_BACKSTAGE',
            x: 36,
            y: 115,
            spriteId: 'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE',
            goToPosition: {
                x: 78,
                y: 207
            },
            destinationSceneId: 'BACKSTAGE',
            relatedDoorId: 'BACKSTAGE_TO_BACKYARD'
        };
        super(options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'BACKSTAGE';
        } else {
            return 'DOOR_TO_BACKSTAGE';
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
        player.say('THAT_S_THE_DOOR_TO_GO_BACK_TO_THE_BACKSTAGE');
    }
}