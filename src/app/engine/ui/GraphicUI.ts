import { uiLayers } from './UILayers.singleton';
import { layout } from './LayoutManager.singleton';
import { VerbsUI } from './VerbsUI';


export class GraphicUI {

    constructor() {
        this.createBackground();
        new VerbsUI();
        // this.UICurrentAction = new UICurrentAction(phaserGame);
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