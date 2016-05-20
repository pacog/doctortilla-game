var selectedVerb = require('../state/SelectedVerb.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var highlightedThing = require('../state/HighlightedThing.singleton.js');
var style = require('./Style.singleton.js');

class UICurrentAction {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createText();
        selectedVerb.subscribeToChange(newVerb => this._updateText());
        highlightedThing.subscribeToChange(newThing => this._updateText());
    }

    _createText() {
        this.shadowText = this.phaserGame.add.bitmapText(
            1 + layout.CURRENT_ACTION_POSITION.x,
            1 + layout.CURRENT_ACTION_POSITION.y,
            'font_32_black',
            '',
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);
        this.shadowText.fixedToCamera = true;

        this.text = this.phaserGame.add.bitmapText(
            layout.CURRENT_ACTION_POSITION.x,
            layout.CURRENT_ACTION_POSITION.y,
            'font_32_white',
            '',
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
        this.text.fixedToCamera = true;
    }

    _updateText() {
        let newText = this._getVerbText() + ' ' + this._getThingText();
        this._setText(newText);
    }

    _setText(newText) {
        if(this._oldText !== newText) {
            this._oldText = newText;
            this.text.setText(newText);
            this.shadowText.setText(newText);
        }
    }

    _getVerbText() {
        let verb = selectedVerb.verb;
        let text = '';
        if (verb && verb.label) {
            text = verb.label;
        }
        return text;
    }

    _getThingText() {
        let thing = highlightedThing.thing;
        let text = '';
        if (thing && thing.name) {
            text = thing.name;
        }
        return text;
    }
}

module.exports = UICurrentAction;