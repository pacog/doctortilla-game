var Game = require('../engine/Game.js');
var BackstageScene = require('./BackstageScene.js');
var Player = require('../engine/Player.js');

class DoctortillaGame extends Game {
    constructor(phaserGame) {
        super(phaserGame);

        this.currentScene = new BackstageScene(this.phaserGame);

        this.player = new Player(this.phaserGame);

        this.initUI();

    }

}

module.exports = DoctortillaGame;
