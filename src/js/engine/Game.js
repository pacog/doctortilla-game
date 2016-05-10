var Scene = require('./scene.js');
var GraphicUI = require('./GraphicUI.js');

class Game {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this.currentScene = new Scene(this.phaserGame);
        this.graphicUI = new GraphicUI(this.phaserGame);
    }
}

module.exports = Game;
