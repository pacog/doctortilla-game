var UIVerbs = require('./UIVerbs.js');
var UICurrentAction = require('./UICurrentAction.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        this._createBackground();
        this.UIVerbs = new UIVerbs(phaserGame);
        this.UICurrentAction = new UICurrentAction(phaserGame);

    }

    _createBackground() {

    }
}

module.exports = GraphicUI;