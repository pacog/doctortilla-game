import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { ConversationWithBand } from './ConversationWithBand';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';
import { randomText } from '../../engine/utils/RandomText';
import { selectedThing } from '../../engine/state/SelectedObjects';

let spriteOptions = new Map();

spriteOptions.set('quiet', { frames: [0]});
spriteOptions.set('juan_talking', { frames: [1, 2, 3, 4, 5, 6]});
spriteOptions.set('angel_talking', { frames: [7, 8, 9, 10, 11, 12]});
spriteOptions.set('santi_talking', { frames: [13, 14, 15, 16, 17, 18]});
spriteOptions.set('santi_drinking', { frames: [19, 20, 21, 22]});

export class BandInSofa extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 481,
            y: 105,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'REST_OF_THE_BAND',
            goToPosition: {
                x: 459,
                y: 181
            },
            directionToLook: Directions.RIGHT,
            spriteOptions: spriteOptions,
            animationSpeed: style.DEFAULT_ANIMATION_SPEED
        };
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    lookAction(player: DoctortillaPlayer): void {
        player.say(randomText(
            'THAT_IS_MY_BAND_1',
            'THAT_IS_MY_BAND_2',
            'THAT_IS_MY_BAND_3'
        ));
    }

    speakAction(player: DoctortillaPlayer): void {
        this.startConversation(player);
    }

    say(text: string, who: string): Promise<void> {
        this.playAnimation(who + '_talking');
        return this.speechBubble.say(text).then(() => {
            this.playAnimation('quiet');
        });
    }

    protected giveAction(player: DoctortillaPlayer): void {
        var thing = selectedThing.thing;
        if (thing.id === 'cable') {
            this.startConversation(player);
        } else if (thing.id === 'glass') {
            if(thing.getAttr('FILLED') && thing.getAttr('POWDER_INSIDE')) {
                this.startConversation(player);
            } else {
                player.say('I_SHOULD_PUT_SOMETHING_MORE_INTERESTING_IN_THE_GLASS');
            }
        } else if (thing.id === 'costume') {
            if(player.getAttr('COSTUME_COMPLETE')) {
                this.startConversation(player);
            } else {
                player.say('I_HAVE_TO_FINISH_THE_COSTUME_FIRST');
            }
        } else {
            super.useAction(player);
        }
    }

    private startConversation(player: DoctortillaPlayer) : void {
        player.goToThing(this).then(
            () => new ConversationWithBand(player, this)
        );
    }
}
