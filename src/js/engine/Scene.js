var Thing = require('./Thing.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');

class Scene {
    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this._createBackground();
        this.door = new Thing(this.phaserGame);

    }

    _createBackground() {
        let background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.options.BG);
        background.anchor.setTo(0, 0);

        background.inputEnabled = true;
        background.pixelPerfectClick = true;
        background.events.onInputDown.add( (dest, ev) => {
            actionDispatcher.execute(actions.CLICK_STAGE, ev);
        });

    }
}

module.exports = Scene;
