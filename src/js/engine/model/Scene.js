var Player = require('./player.js');

class Scene {
    constructor(phaserGame) {
        this.BG = 'scene1_BG';

        this.phaserGame = phaserGame;
        this.createBackground();
        this.player = new Player(this.phaserGame);
    }

    createBackground() {
        var background = this.phaserGame.add.sprite(
                    this.phaserGame.world.centerX,
                    this.phaserGame.world.centerY,
                    this.BG);
        background.anchor.setTo(0.5, 0.5);
    }
}

module.exports = Scene;
