import { Player } from '../models/Player';
import { Thing } from '../models/Thing';
import { TextInScene } from './TextInScene';

interface ISpeechBubbleOptions {
    owner: Player | Thing
}

export class SpeechBubble {

    private textBeingSaid: TextInScene;

    constructor(private options: ISpeechBubbleOptions) {}

    say(text: string): Promise<void> {
        //TODO handle animations
        this.destroyPrevText();
        this.textBeingSaid = new TextInScene({
            text: text,
            position: this.options.owner.getPositionOnTop(),
            autoDestroy: true
        });
        return this.textBeingSaid.promise;
    }

    private destroyPrevText():void {
        if (this.textBeingSaid) {
            this.textBeingSaid.destroy();
            this.textBeingSaid = null;
        }
    }
}
