import { layout } from './LayoutManager.singleton';
import { uiLayers } from './UILayers.singleton';
import { IPoint } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { label } from '../stores/Labels.store';
import { TextWithShadow } from './TextWithShadow';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';

export class ReflectButton {
    private position: IPoint;

    constructor() {
        this.position = layout.getReflectButtonPosition();

        this.createButton();
        this.createText();

    }

    private createButton(): void {
        let button = phaserGame.value.add.button(
            this.position.x,
            this.position.y,
            'REFLECT_BUTTON_BG',
            this.onClick,
            this,
            1,
            0,
            2,
            1
        );
        uiLayers.verbButtons.add(button);
        button.fixedToCamera = true;
    }

    private createText(): void {
        let position = {
            x: this.position.x + layout.getReflectButtonSize().width / 2,
            y: this.position.y + layout.getReflectButtonSize().height / 2
        };
        new TextWithShadow({
            initialText: label('Reflect'),
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
        actionDispatcher.execute(Actions.REFLECT);
    }
}