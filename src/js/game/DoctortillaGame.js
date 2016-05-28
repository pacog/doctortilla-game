var Game = require('../engine/models/Game.js');
var Labels = require('./Labels.store.js');
var BackstageScene = require('./BackstageScene.js');
var BackyardScene = require('./BackyardScene.js');
var DoctortillaPlayer = require('./DoctortillaPlayer.js');

class DoctortillaGame extends Game {

    constructor(phaserGame) {

        let options = {
            player: DoctortillaPlayer,
            scenes: [BackstageScene, BackyardScene],
            firstScene: BackstageScene,
            labels: Labels
        };
        super(phaserGame, options);

    }

}

module.exports = DoctortillaGame;
