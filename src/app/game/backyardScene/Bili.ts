import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { ConversationWithBili } from './ConversationWithBili';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'bili',
    x: 265,
    y: 121,
    spriteId: 'BILI',
    name: 'bili',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions.RIGHT
};

export class Bili extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    protected lookAction(player: DoctortillaPlayer): void {
        player.say('El bili!');
    }

    protected speakAction(player: DoctortillaPlayer): void {
        player.goToThing(this).then(
            () => new ConversationWithBili(player, this)
        );
    }

    say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }
}
