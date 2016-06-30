import { uiLayers } from './UILayers.singleton';
import { layout } from './LayoutManager.singleton';
import { VerbsUI } from './VerbsUI';
import { CurrentActionUI } from './CurrentActionUI';
import { InventoryUI } from './InventoryUI';

export class GraphicUI {

    constructor() {
        this.createBackground();
        new VerbsUI();
        new CurrentActionUI();
        new InventoryUI();
        // this.UIReflectButton = new UIReflectButton(phaserGame);
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