import { IPoint } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { style } from './Style';

interface ITextWithShadowOptions {
    position: IPoint,
    layer: Phaser.Group,
    initialText?: string,
    fixedToCamera?: Boolean,
    anchor?: IPoint,
    align?: string,
    foregroundTextStyle?: string,
    shadowTextStyle?: string
}

const DEFAULT_FOREGROUND_TEXT = 'FONT_32_WHITE';
const DEFAULT_SHADOW_TEXT = 'FONT_32_BLACK';


export class TextWithShadow {
    private shadowText: Phaser.BitmapText;
    private text: Phaser.BitmapText;

    constructor(private options: ITextWithShadowOptions) {
        let anchor: IPoint = this.options.anchor || {
            x: 0,
            y: 0
        };
        this.shadowText = phaserGame.value.add.bitmapText(
            1 + options.position.x,
            1 + options.position.y,
            this.shadowTextStyle,
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(anchor.x, anchor.y);
        this.shadowText.fixedToCamera = !!this.options.fixedToCamera;

        if(this.options.align) {
            this.shadowText.align = this.options.align;
        }

        this.options.layer.add(this.shadowText);

        this.text = phaserGame.value.add.bitmapText(
            options.position.x,
            options.position.y,
            this.foregroundTextStyle,
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(anchor.x, anchor.y);
        this.text.fixedToCamera = !!this.options.fixedToCamera;

        if(this.options.align) {
            this.text.align = this.options.align;
        }

        this.options.layer.add(this.text);
    }

    setText(text: string) {
        this.shadowText.setText(text);
        this.text.setText(text);
    }

    setPosition(newPosition: IPoint): void {
        if(this.text && this.shadowText) {
            this.text.x = newPosition.x;
            this.text.y = newPosition.y;
            this.shadowText.x = newPosition.x + 1;
            this.shadowText.y = newPosition.y + 1;
        }
    }

    private get foregroundTextStyle(): string {
        return this.options.foregroundTextStyle || DEFAULT_FOREGROUND_TEXT;
    }

    private get shadowTextStyle(): string {
        return this.options.shadowTextStyle || DEFAULT_SHADOW_TEXT;
    }

    destroy(): void {
        if(this.text) {
            this.text.destroy();
            this.text = null;
        }
        if(this.shadowText) {
            this.shadowText.destroy();
            this.shadowText = null;
        }
    }
}