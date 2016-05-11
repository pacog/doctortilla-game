var UIVerbs = require('./UIVerbs.js');
var UICurrentAction = require('./UICurrentAction.js');
var layout = require('./LayoutManager.singleton.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        this._createBackground();
        this.UIVerbs = new UIVerbs(phaserGame);
        this.UICurrentAction = new UICurrentAction(phaserGame);

    }

    _createBackground() {
        let layoutStartPosition = layout.UI_START_POSITION;
        let layoutSize = layout.UI_SIZE;

        this._background = this.phaserGame.add.graphics(
            layoutStartPosition.x,
            layoutStartPosition.y
        );

        this._background.beginFill(0x000000, 0.5);
        this._background.drawRect(
            0,
            0,
            layoutSize.width,
            layoutSize.height
        );
        this._background.endFill();
        this._background.inputEnabled = true;

    }
}

module.exports = GraphicUI;