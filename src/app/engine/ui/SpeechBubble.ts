import { Player } from '../models/Player';
import { Thing } from '../models/Thing';
import { TextInScene } from './TextInScene';
import { label } from '../stores/Labels.store';

interface ISpeechBubbleOptions {
    owner: Player | Thing,
    foregroundTextStyle?: string,
    shadowTextStyle?: string
}

export class SpeechBubble {

    private textBeingSaid: TextInScene;

    constructor(private options: ISpeechBubbleOptions) {}

    say(text: string): Promise<void> {
        this.destroyPrevText();
        this.textBeingSaid = new TextInScene({
            text: label(text),
            position: this.options.owner.getPositionOnTop(),
            autoDestroy: true,
            foregroundTextStyle: this.options.foregroundTextStyle,
            shadowTextStyle: this.options.shadowTextStyle
        });
        return this.textBeingSaid.promise;
    }

    isShown(): Boolean {
        return !!this.textBeingSaid;
    }

    updatePosition(): void {
        if(!this.isShown()) {
            return;
        }
        this.textBeingSaid.setPosition(this.options.owner.getPositionOnTop());
    }

    setForegroundTextStyle(newStyle: string): void {
        this.options.foregroundTextStyle = newStyle;
    }

    setShadowTextStyle(newStyle: string): void {
        this.options.shadowTextStyle = newStyle;
    }

    private destroyPrevText():void {
        if (this.textBeingSaid) {
            this.textBeingSaid.destroy();
            this.textBeingSaid = null;
        }
    }
}
