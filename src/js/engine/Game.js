var GraphicUI = require('./GraphicUI.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');

class Game {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
    }

    initUI() {
        this.graphicUI = new GraphicUI(this.phaserGame);
    }

    _movePlayerTo(ev) {
        this.player.moveTo(this.currentScene.boundaries.getPositionInside(ev.x, ev.y));
    }
}

module.exports = Game;
