var Scene = require('../engine/scene.js');
var BackstageSceneBoundaries = require('./BackstageSceneBoundaries.js');
var BackstageDoorToStreet = require('./BackstageDoorToStreet.js');

class BackstageScene extends Scene {

    constructor(phaserGame) {
        let options = {
            BG: 'scene1_BG',
            boundaries: BackstageSceneBoundaries,
            things: [BackstageDoorToStreet]
        };

        super(phaserGame, options);

    }

}

module.exports = BackstageScene;