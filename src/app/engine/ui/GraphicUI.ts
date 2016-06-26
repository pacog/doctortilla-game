import { uiLayers } from './UILayers.singleton';
import { layout } from './LayoutManager.singleton';
import { VerbsUI } from './VerbsUI';
import { CurrentActionUI } from './CurrentActionUI';

export class GraphicUI {

    constructor() {
        this.createBackground();
        new VerbsUI();
        new CurrentActionUI();
        // this.UIInventory = new UIInventory(phaserGame);
        // this.UIReflectButton = new UIReflectButton(phaserGame);
        // this.phaserGame.$$mainGroup.sort('z', Phaser.Group.SORT_ASCENDING);
    }

    private createBackground(): void {
        let layoutStartPosition = layout.UI_START_POSITION;
        let background = uiLayers.guiBackground.create(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;
        background.inputEnabled = true;

    }
}