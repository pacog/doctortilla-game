import { Verbs, VerbsInfo } from '../stores/Verbs.store';
import { IPoint } from '../utils/Interfaces';
import { layout } from './LayoutManager.singleton';
import { phaserGame } from '../state/PhaserGame.singleton';
import { phaser } from '../../Phaser';
import { uiLayers } from './UILayers.singleton';
import { label } from '../stores/Labels.store';
import { style } from './Style';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { TextWithShadow } from './TextWithShadow';

export class ActionButton {

    private screenPosition: IPoint;
    private button: Phaser.Button;
    private text: TextWithShadow;

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
        let position = {
            x: this.screenPosition.x + layout.VERB_BUTTON_WIDTH / 2,
            y: this.screenPosition.y + layout.VERB_BUTTON_HEIGHT / 2
        };
        this.text = new TextWithShadow({
            initialText: text,
            position: position,
            fixedToCamera: true,
            layer: uiLayers.verbButtons,
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

    }

    private onClick(): void {
        actionDispatcher.execute(Actions.SELECT_VERB, this.verb);
    }
}