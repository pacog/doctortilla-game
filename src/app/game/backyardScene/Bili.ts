import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { ConversationWithBili } from './ConversationWithBili';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';
import { randomText } from '../../engine/utils/RandomText';

let spriteOptions = new Map();

spriteOptions.set('quiet', { frames: [0, 1, 2, 3, 4, 5]});
spriteOptions.set('smoking', { frames: [6, 7, 8, 9, 10, 11, 12]});
spriteOptions.set('drinking', { frames: [13, 14, 15, 16, 17, 18]});
spriteOptions.set('talking', { frames: [19, 20, 21, 22, 23]});

let options = {
    id: 'bili',
    x: 265,
    y: 121,
    spriteId: 'BILI_SPRITE',
    name: 'BILI',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions.RIGHT,
    spriteOptions: spriteOptions,
    animationSpeed: style.DEFAULT_ANIMATION_SPEED
};

const MIN_TIME_FOR_ANIMATION = 1000;
const MAX_TIME_FOR_ANIMATION = 5000;

export class Bili extends Thing {

    private speechBubble: SpeechBubble;
    private isTalking: Boolean = false;
    private currentTimeout: number;

    constructor() {
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
        
    }

    get name() {
        if (this.getAttr('DRUNK')) {
            return 'DRUNK_BILI';
        } else {
            return 'BILI';
        }
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.getAttr('DRUNK')) {
            player.say(randomText(
                'HE_IS_DRUNK_AS_A_SKUNK',
                'PROBABLY_IF_I_SCARE_HIM_HE_WILL_WAKE_UP',
                'I_HAVE_TO_FIND_A_WAY_TO_SOBER_HIM_UP'
            ));
        } else {
            player.say(randomText(
                'HE_IS_DRINKING_LIKE_A_MANIAC',
                'ALL_IN_ALL_HE_IS_A_GOOD_GUY',
                'NICE_COSTUME_HE_MADE'
            ));
        }
        
    }

    protected speakAction(player: DoctortillaPlayer): void {
        player.goToThing(this).then(
            () => new ConversationWithBili(player, this)
        );
    }

    say(text: string): Promise<void> {
        this.isTalking = true;
        if(this.currentTimeout) {
            window.clearTimeout(this.currentTimeout);
        }
        this.playAnimation('talking');
        return this.speechBubble.say(text).then(() => {
            this.isTalking = false;
            this.playAnimationSometime();
        });
    }

    show(): void {
        super.show();
        this.playAnimationSometime();
    }

    //Duplicated in Balloon, if we add more objects like this, consider moving to Thing model
    private playAnimationSometime(): void {
        this.playAnimation('quiet');
        this.currentTimeout = setTimeout(() => {
            this.playAnimationOnce(this.getRandomAnimation()).then(() => {
                this.playAnimationSometime();
            });
        }, this.getTimeForNextAnimation());
    }

    private getTimeForNextAnimation(): number {
        return MIN_TIME_FOR_ANIMATION + Math.random()*(MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }

    private getRandomAnimation(): string {
        if(Math.random() > 0.5) {
            return 'smoking';
        } else {
            return 'drinking';
        }
    }
}
