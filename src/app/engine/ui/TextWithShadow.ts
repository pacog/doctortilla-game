import { IPoint } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { style } from './Style';

interface ITextWithShadowOptions {
    position: IPoint,
    layer: Phaser.Group,
    initialText?: string,
    fixedToCamera?: Boolean,
    anchor?: IPoint
}

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
            'FONT_32_BLACK',
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(anchor.x, anchor.y);
        this.shadowText.fixedToCamera = !!this.options.fixedToCamera;

        this.options.layer.add(this.shadowText);

        this.text = phaserGame.value.add.bitmapText(
            options.position.x,
            options.position.y,
            'FONT_32_WHITE',
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(anchor.x, anchor.y);
        this.text.fixedToCamera = !!this.options.fixedToCamera;
        this.options.layer.add(this.text);
    }

    setText(text: string) {
        this.shadowText.setText(text);
        this.text.setText(text);
    }
}