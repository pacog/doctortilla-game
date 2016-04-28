var Player = require('./Player.js');
var SceneBoundaries = require('./SceneBoundaries.js');

class Scene {
    constructor(phaserGame) {
        this.BG = 'scene1_BG';

        this.phaserGame = phaserGame;
        this.createBackground();
        this.player = new Player(this.phaserGame);
        this.sceneBoundaries = new SceneBoundaries();
    }

    createBackground() {
        var background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.BG);
        background.anchor.setTo(0, 0);

        background.inputEnabled = true;
        background.pixelPerfectClick = true;
        background.events.onInputDown.add( (dest, ev) => {
            this.handleClick(ev.x, ev.y);
        });
    }


    handleClick(x, y) {
        this.player.moveTo(this.sceneBoundaries.getPositionInside(x, y));
    }
}

module.exports = Scene;
