import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { ConversationWithBili } from './ConversationWithBili';

let options = {
    id: 'bili',
    x: 274,
    y: 151,
    spriteId: 'BILI',
    name: 'bili',
    goToPosition: {
        x: 260,
        y: 215
    }
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
