var Scene = require('../engine/models/Scene.js');
var BackyardSceneBoundaries = require('./BackyardSceneBoundaries.js');
var BackyardDoorToBackstage = require('./BackyardDoorToBackstage.js');
var Bili = require('./Bili.js');
var Flowers = require('./Flowers.js');
var scenes = require('./Scenes.store.js');

class BackyardScene extends Scene {

    constructor(phaserGame, state) {
        let options = {
            BG: 'backyard_BG',
            boundaries: BackyardSceneBoundaries,
            things: [BackyardDoorToBackstage, Bili, Flowers]
        };

        super(phaserGame, options, state);

    }

    static get id() {
        return scenes.BACKYARD;
    }

}

module.exports = BackyardScene;