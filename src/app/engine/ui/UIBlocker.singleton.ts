import { layout } from './LayoutManager.singleton';
import { phaser } from '../../Phaser';
import { phaserGame } from '../state/PhaserGame.singleton';
import { uiLayers } from './UILayers.singleton';

class UIBlocker {

    overlay: Phaser.Image;

    block() {
        let graphicOverlay = new Phaser.Graphics(phaserGame.value, 0, 0);
        graphicOverlay.beginFill(0x000000, 0.0);
        graphicOverlay.drawRect(0, 0, layout.WIDTH, layout.UI_START_POSITION.y);
        graphicOverlay.endFill();

        this.overlay = phaserGame.value.add.image(0, 0, graphicOverlay.generateTexture());
        this.overlay.fixedToCamera = true;
        this.overlay.inputEnabled = true;

        uiLayers.uiBlocker.add(this.overlay);
    }

    unblock() {
        this.overlay.destroy();
    }
}

export const uiBlocker = new UIBlocker();

