var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');

class Scene {

    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this._createBackground();
        this._createBoundaries();
        this._createThings();

    }

    get boundaries() {
        return this._boundaries;
    }

    get sceneBounds() {
        return this.background.getBounds();
    }

    _createBackground() {
        this.background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.options.BG);
        this.background.anchor.setTo(0, 0);

        this.background.inputEnabled = true;
        this.background.pixelPerfectClick = true;
        this.background.events.onInputDown.add( (dest, ev) => {
            actionDispatcher.execute(actions.CLICK_STAGE, ev);
        });

    }

    _createBoundaries() {
        this._boundaries = new this.options.boundaries();
    }

    _createThings() {
        this._things = new Set();
        var things = this.options.things || [];
        for (let i = 0; i < things.length; i++) {
            this._things.add(new things[i](this.phaserGame));
        }
    }
}

module.exports = Scene;
