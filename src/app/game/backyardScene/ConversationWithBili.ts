import { Conversation, IConversationScript } from '../../engine/models/Conversation';
import { ConversationLine } from '../../engine/models/ConversationLine';
import { Player } from '../../engine/models/Player';
import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Bili } from './Bili';

const script: IConversationScript = {
    'initial': [
        new ConversationLine(
            () => {
                return 'Que dise el tio?';
            },
            'initial',
            (player: DoctortillaPlayer, bili: Bili) => {
                return bili.say('Pues aquí estamos');
            }
        ),
        new ConversationLine('Adiós!', 'end')
    ]
};

export class ConversationWithBili extends Conversation {

    constructor(protected player: DoctortillaPlayer, protected otherPerson: Thing) {
        super(player, otherPerson);
    }

    protected initState(): void {
        this.state = 'initial';
    }

    protected loadScript(): void {
        this.script = script;
    }

}
