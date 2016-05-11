var selectedVerb = require('./SelectedVerb.singleton.js');
var layout = require('./LayoutManager.singleton.js');

//TODO duplicated, extract this and shadows to style singleton
const DEFAULT_FONT_SIZE = 8;

class UICurrentAction {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createText();
        selectedVerb.subscribeToChange(newVerb => this._newVerbSelected(newVerb));
    }

    _createText() {

        this.shadowText = this.phaserGame.add.bitmapText(
            1 + layout.CURRENT_ACTION_POSITION.x,
            1 + layout.CURRENT_ACTION_POSITION.y,
            'font_32_black',
            '',
            DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);

        this.text = this.phaserGame.add.bitmapText(
            layout.CURRENT_ACTION_POSITION.x,
            layout.CURRENT_ACTION_POSITION.y,
            'font_32_white',
            '',
            DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
    }

    _newVerbSelected(newVerb) {
        let newText = '';
        if (newVerb && newVerb.label) {
            newText = newVerb.label;
        }
        this.text.setText(newText);
        this.shadowText.setText(newText);
    }
}

module.exports = UICurrentAction;