var ActionButton = require('./ActionButton.js');
var Verbs = require('./Verbs.js');

class GraphicUI {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        this._createBackground();
        this._createButtons();
    }

    _createButtons() {
        this.buttons = [
            new ActionButton(this.phaserGame,
                             Verbs.GO_TO,
                             {x: 0, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.LOOK,
                             {x: 0, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.REFLECT,
                             {x: 0, y: 2}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.PUSH,
                             {x: 1, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.TAKE,
                             {x: 1, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.USE,
                             {x: 1, y: 2}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.SPEAK,
                             {x: 2, y: 0}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.GIVE,
                             {x: 2, y: 1}
                            ),
            new ActionButton(this.phaserGame,
                             Verbs.OPEN,
                             {x: 2, y: 2}
                            )
        ];
    }

    _createBackground() {

    }
}

module.exports = GraphicUI;