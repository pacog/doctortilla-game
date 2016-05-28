var layout = require('./LayoutManager.singleton.js');

class UIBlocker {

    block(phaserGame) {
        this.phaserGame = phaserGame;

        this._graphicOverlay = new Phaser.Graphics(this.phaserGame, 0, 0);
        this._graphicOverlay.beginFill(0x000000, 0.0);
        this._graphicOverlay.drawRect(0, 0, layout.WIDTH, layout.UI_START_POSITION.y);
        this._graphicOverlay.endFill();
        this._overlay = this.phaserGame.add.image(0, 0, this._graphicOverlay.generateTexture());
        this._overlay.fixedToCamera = true;
        this._overlay.inputEnabled = true;

    }

    unblock() {
        this._overlay.destroy();
    }
}

const uiBlocker = new UIBlocker();
module.exports = uiBlocker;
