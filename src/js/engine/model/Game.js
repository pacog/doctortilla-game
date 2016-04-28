var Scene = require('./scene.js');

class Game {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this.currentScene = new Scene(this.phaserGame);
    }
}

module.exports = Game;
