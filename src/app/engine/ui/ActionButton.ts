import { Verbs, VerbsInfo } from '../stores/Verbs.store';
import { IPoint } from '../utils/Interfaces';
import { layout } from './LayoutManager.singleton';
import { phaserGame } from '../state/PhaserGame.singleton';
import { phaser } from '../Phaser';
import { uiLayers } from './UILayers.singleton';
import { label } from '../stores/Labels.store';
import { style } from './Style';

export class ActionButton {

    private screenPosition: IPoint;
    private button: Phaser.Button;
    private shadowText: Phaser.BitmapText;
    private text: Phaser.BitmapText;

    constructor(private verb: Verbs, position: IPoint) {
        this.screenPosition = layout.getVerbButtonPosition(position);
        this.createButton();
        this.createText();
    }

    highlight(): void {
        this.button.frame = 2;
    }

    unhighlight(): void {
        this.button.frame = 0;
    }

    private createButton(): void {
        this.button = phaserGame.value.add.button(
            this.screenPosition.x,
            this.screenPosition.y,
            'BUTTON_BG',
            this.onClick,
            this,
            1,
            0,
            2,
            1
        );
        uiLayers.verbButtons.add(this.button);
        this.button.fixedToCamera = true;
    }

    private createText(): void {
        let text = label(VerbsInfo.get(this.verb).label);

        this.shadowText = phaserGame.value.add.bitmapText(
            1 + this.screenPosition.x + layout.VERB_BUTTON_WIDTH / 2,
            1 + this.screenPosition.y + layout.VERB_BUTTON_HEIGHT / 2,
            'FONT_32_BLACK',
            text,
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0.5, 0.5);
        this.shadowText.fixedToCamera = true;
        uiLayers.verbButtons.add(this.shadowText);

        this.text = phaserGame.value.add.bitmapText(
            this.screenPosition.x + layout.VERB_BUTTON_WIDTH / 2,
            this.screenPosition.y + layout.VERB_BUTTON_HEIGHT / 2,
            'FONT_32_WHITE',
            text,
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0.5, 0.5);
        this.text.fixedToCamera = true;
        uiLayers.verbButtons.add(this.text);

    }

    private onClick(): void {
        console.log(this.verb);
        // actionDispatcher.execute(actions.SELECT_VERB, this.verb);
    }
}