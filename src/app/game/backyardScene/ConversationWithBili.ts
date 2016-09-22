import { Conversation, IConversationScript } from '../../engine/models/Conversation';
import { ConversationLine } from '../../engine/models/ConversationLine';
import { Player } from '../../engine/models/Player';
import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Bili } from './Bili';
import { scenes } from '../../engine/state/Scenes.singleton';
import { randomText } from '../../engine/utils/RandomText';

const script: IConversationScript = {
    'initial': [
        new ConversationLine(
            () => {
                return 'HEY_BILI_HOW_IS_IT_GOING';
            },
            'initial',
            (player: DoctortillaPlayer, bili: Bili) => {
                return bili.say('NOT_TO_BAD_ALL_THINGS_CONSIDERED')
                    .then(() => {
                        return bili.say('I_HEARD_THE_GUYS_ARE_HAVING_SOME_PROBLEMS');
                    })
                    .then(() => {
                        return bili.say('I_WILL_WAIT_FOR_THEM_TO_BE_SOLVED');
                    });
            }
        ),
        new ConversationLine(
            () => {
                return 'PLEASE_DONT_DRINK_TOO_MUCH';
            },
            'initial',
            (player: DoctortillaPlayer, bili: Bili) => {
                return bili.say(randomText(
                    'YES_MOM',
                    'I_AM_JUST_KEEPING_MY_THROAT_WARM',
                    'HAVE_I_EVER_FAILED_YOU',
                    'YOUR_LACK_OF_CONFIDENCE_DISSAPOINTS_ME'
                ));
            }
        ),
        new ConversationLine('OK_SEE_YOU_LATER', 'end')
    ],
    'drunk': [
        new ConversationLine(
            () => {
                return 'HEY_BILI_READY_TO_PLAY';
            },
            'drunk',
            (player: DoctortillaPlayer, bili: Bili) => {
                return bili.say(randomText(
                    'DRUNK_1',
                    'DRUNK_2',
                    'DRUNK_3',
                    'DRUNK_4',
                    'DRUNK_5',
                    'DRUNK_6'
                ));
            }
        ),
        new ConversationLine(
            () => {
                return 'OH_MY_YOU_ARE_DRUNK_ARENT_YOU';
            },
            'drunk',
            (player: DoctortillaPlayer, bili: Bili) => {
                return bili.say(randomText(
                    'DRUNK_1',
                    'DRUNK_2',
                    'DRUNK_3',
                    'DRUNK_4',
                    'DRUNK_5',
                    'DRUNK_6'
                ));
            }
        ),
        new ConversationLine('OK_SEE_YOU_LATER', 'end')
    ]
};

export class ConversationWithBili extends Conversation {

    constructor(protected player: DoctortillaPlayer, protected otherPerson: Thing) {
        super(player, otherPerson);
    }

    protected initState(): void {
        let bili = scenes.getSceneById('BACKYARD').getThingById('bili');
        if (bili.getAttr('DRUNK')) {
            this.state = 'drunk';
        } else {
            this.state = 'initial';
        }
    }

    protected loadScript(): void {
        this.script = script;
    }

}
