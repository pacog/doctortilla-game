var ActionButton = require('./ActionButton.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this.createButtons();
    }

    createButtons() {
        this.buttons = [
            new ActionButton(this.phaserGame, 'Go to', {x: 100, y: 220})
        ];
    }
}

module.exports = GraphicUI;