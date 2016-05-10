var Game = require('../engine/Game.js');
var BackstageScene = require('./BackstageScene.js');
var DoctortillaPlayer = require('./DoctortillaPlayer.js');

class DoctortillaGame extends Game {

    constructor(phaserGame) {

        let options = {
            player: DoctortillaPlayer,
            scenes: [BackstageScene],
            firstScene: BackstageScene
        };
        super(phaserGame, options);

    }

}

module.exports = DoctortillaGame;
