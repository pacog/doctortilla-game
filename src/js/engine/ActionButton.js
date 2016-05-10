var actionDispatcher = require('./ActionDispatcher.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var actions = require('./Actions.singleton.js');

const DEFAULT_FONT_SIZE = 10;

class ActionButton {

    constructor(phaserGame, verb, position) {
        this.phaserGame = phaserGame;
        this._position = layout.getVerbButtonPosition(position);
        this.verb = verb;

        this._createButton();
        this._createText();

    }

    _createButton() {
        this.phaserGame.add.button(
            this._position.x,
            this._position.y,
            'buttons_BG',
            this._onClick,
            this,
            1,
            0,
            2,
            3
        );
    }

    _createText() {

        this.text = this.phaserGame.add.bitmapText(
            this._position.x + layout.VERB_BUTTON_WIDTH / 2,
            this._position.y + layout.VERB_BUTTON_HEIGHT / 2,
            'font_1',
            this.verb.label,
            DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0.5, 0.5);
    }

    _onClick() {
        actionDispatcher.execute(actions.SELECT_VERB, this.verb);
    }

}

module.exports = ActionButton;