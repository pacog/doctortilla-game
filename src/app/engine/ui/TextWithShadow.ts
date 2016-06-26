import { IPoint } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { style } from './Style';

interface ITextWithShadowOptions {
    position: IPoint,
    layer: Phaser.Group,
    initialText?: string,
    fixedToCamera?: Boolean
}

export class TextWithShadow {
    private shadowText: Phaser.BitmapText;
    private text: Phaser.BitmapText;

    constructor(private options: ITextWithShadowOptions) {
        this.shadowText = phaserGame.value.add.bitmapText(
            1 + options.position.x,
            1 + options.position.y,
            'FONT_32_BLACK',
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);
        this.shadowText.fixedToCamera = !!this.options.fixedToCamera;

        this.options.layer.add(this.shadowText);

        this.text = phaserGame.value.add.bitmapText(
            options.position.x,
            options.position.y,
            'FONT_32_WHITE',
            this.options.initialText || '',
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
        this.text.fixedToCamera = !!this.options.fixedToCamera;
        this.options.layer.add(this.text);
    }

    setText(text: string) {
        this.shadowText.setText(text);
        this.text.setText(text);
    }
}