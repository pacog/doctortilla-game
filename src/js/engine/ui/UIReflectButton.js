var actionDispatcher = require('../ActionDispatcher.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var actions = require('../stores/Actions.store.js');
var style = require('./Style.singleton.js');
var labels = require('../Labels.singleton.js');

class UIReflectButton {

    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._position = layout.getReflectButtonPosition();

        this._createButton();
        this._createText();

    }

    _createButton() {
        this.button = this.phaserGame.add.button(
            this._position.x,
            this._position.y,
            'buttons_BG',
            this._onClick,
            this,
            1,
            0,
            2,
            1
        );
        this.button.scale.y = 3;
        this.button.fixedToCamera = true;

        this.phaserGame.$$mainGroup.add(this.button);
        this.button.z = layout.z.VERBS_BUTTONS;
    }

    _createText() {

        this.shadowText = this.phaserGame.add.bitmapText(
            1 + this._position.x + layout.getReflectButtonSize().width / 2,
            1 + this._position.y + layout.getReflectButtonSize().height / 2,
            'font_32_black',
            labels.l('Reflect'),
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0.5, 0.5);
        this.shadowText.fixedToCamera = true;

        this.phaserGame.$$mainGroup.add(this.shadowText);
        this.shadowText.z = layout.z.VERBS_BUTTONS_TEXT;

        this.text = this.phaserGame.add.bitmapText(
            this._position.x + layout.getReflectButtonSize().width / 2,
            this._position.y + layout.getReflectButtonSize().height / 2,
            'font_32_white',
            labels.l('Reflect'),
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0.5, 0.5);
        this.text.fixedToCamera = true;
        this.phaserGame.$$mainGroup.add(this.text);
        this.text.z = layout.z.VERBS_BUTTONS_TEXT + 1;
    }

    _onClick() {
        actionDispatcher.execute(actions.REFLECT);
    }

}

module.exports = UIReflectButton;