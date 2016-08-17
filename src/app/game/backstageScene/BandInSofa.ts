
// var ConversationWithBand = require('./ConversationWithBand.js');
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { ConversationWithBand } from './ConversationWithBand';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Directions } from '../../engine/utils/Directions';

export class BandInSofa extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 481,
            y: 105,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'rest of the band',
            goToPosition: {
                x: 459,
                y: 181
            },
            directionToLook: Directions.RIGHT
        };
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    lookAction(player: DoctortillaPlayer): void {
        player.say('There is my band.');
    }

    speakAction(player: DoctortillaPlayer): void {
        player.goToThing(this).then(
            () => new ConversationWithBand(player, this)
        );
    }

    say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }
}
