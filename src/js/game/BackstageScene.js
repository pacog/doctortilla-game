var Scene = require('../engine/scene.js');
var BackstageSceneBoundaries = require('./BackstageSceneBoundaries.js');

class BackstageScene extends Scene {
    constructor(phaserGame) {
        super(phaserGame, {
            BG: 'scene1_BG'
        });
        this._boundaries = new BackstageSceneBoundaries();
    }

    get boundaries() {
        return this._boundaries;
    }
}

module.exports = BackstageScene;