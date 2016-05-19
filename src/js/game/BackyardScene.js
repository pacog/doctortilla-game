var Scene = require('../engine/scene.js');
var BackyardSceneBoundaries = require('./BackyardSceneBoundaries.js');
var scenes = require('./Scenes.js');

class BackyardScene extends Scene {

    constructor(phaserGame) {
        let options = {
            BG: 'backyard_BG',
            boundaries: BackyardSceneBoundaries,
            things: []
        };

        super(phaserGame, options);

    }

    static get id() {
        return scenes.BACKYARD;
    }

}

module.exports = BackyardScene;