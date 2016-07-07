
// var ConversationWithBand = require('./ConversationWithBand.js');
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { ConversationWithBand } from './ConversationWithBand';

export class BandInSofa extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        let options = {
            id: 'bandInSofa',
            x: 434,
            y: 116,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'rest of the band',
            goToPosition: {
                x: 410,
                y: 186
            }
        };
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    lookAction(player: Player): void {
        player.say('There is my band.');
    }

    speakAction(player: Player): void {
        player.goToThing(this).then(
            () => new ConversationWithBand(player, this)
        );
    }

    say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }
}
