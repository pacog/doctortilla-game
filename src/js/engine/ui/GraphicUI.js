var UIVerbs = require('./UIVerbs.js');
var UICurrentAction = require('./UICurrentAction.js');
var UIInventory = require('./UIInventory.js');
var UIReflectButton = require('./UIReflectButton.js');
var layout = require('./LayoutManager.singleton.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        this._createBackground();
        this.UIVerbs = new UIVerbs(phaserGame);
        this.UICurrentAction = new UICurrentAction(phaserGame);
        this.UIInventory = new UIInventory(phaserGame);
        this.UIReflectButton = new UIReflectButton(phaserGame);

    }

    _createBackground() {
        let layoutStartPosition = layout.UI_START_POSITION;
        // let layoutSize = layout.UI_SIZE;

        let background = this.phaserGame.add.sprite(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;

        background.inputEnabled = true;

    }
}

module.exports = GraphicUI;