import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { Directions } from '../../engine/utils/Directions';
import { randomText } from '../../engine/utils/RandomText';

let options = {
    id: 'bacsktage_door_to_street',
    x: 59,
    y: 100,
    spriteId: 'BACKSTAGE_DOOR_TO_STREET',
    name: 'DOOR_TO_STREET',
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
        player.say('NOPE_I_CANNOT_GO_TO_THE_STREET')
            .then(() => {
                return player.say('I_HAVE_A_CONCERT_TO_PLAY');
            });
    }

    protected closeAction(player: Player): void  {
        player.say('IT_IS_ALREADY_CLOSED');
    }

    protected takeAction(player: Player): void  {
        player.say('CANNOT_PICK_A_DOOR_UP');
    }

    protected pushAction(player: Player): void  {
        player.lookAt(Directions.DOWN);
        player.say('NOPE_I_CANNOT_GO_TO_THE_STREET')
            .then(() => {
                return player.say('I_HAVE_A_CONCERT_TO_PLAY');
            });
    }

    protected speakAction(player: Player): void  {
        player.lookAt(Directions.LEFT);
        player.say(randomText(
            'HI_DOOR_HOW_ARE_YOU_TODAY',
            'SHE_IS_SHY_DOESNT_WANT_TO_TALK_TO_ME',
            'I_HAVE_BETTER_THINGS_TO_DO_THAN_TALKING'
        ));
    }

    protected lookAction(player: Player): void  {
        player.lookAt(Directions.LEFT);
        player.say(randomText(
            'NICE_SAFE_DOOR',
            'MADE_OF_METAL_RUST_AND_STICKY_STUFF',
            'I_CAN_HEAR_THE_CROWD_WAITING_FOR_US'
        ));
    }
}
