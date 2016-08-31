import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { ConversationWithBili } from './ConversationWithBili';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';

let spriteOptions = new Map();

spriteOptions.set('smoking', { frames: [1, 2, 3, 4, 5]});

let options = {
    id: 'bili',
    x: 265,
    y: 121,
    spriteId: 'BILI_SPRITE',
    name: 'bili',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions.RIGHT,
    spriteOptions: spriteOptions,
    animationSpeed: style.DEFAULT_ANIMATION_SPEED
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

    show(): void {
        super.show();
        this.playAnimation('smoking');
    }
}
