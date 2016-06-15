var selectedVerb = require('../state/SelectedVerb.singleton.js');
var layout = require('./LayoutManager.singleton.js');
var highlightedThing = require('../state/HighlightedThing.singleton.js');
var selectedThing = require('../state/SelectedThing.singleton.js');
var style = require('./Style.singleton.js');
var labels = require('../Labels.singleton.js');

class UICurrentAction {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this._createText();
        selectedVerb.subscribeToChange(newVerb => this._updateText());
        highlightedThing.subscribeToChange(newThing => this._updateText());
        selectedThing.subscribeToChange(newThing => this._updateText());
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
        this.phaserGame.$$mainGroup.add(this.shadowText);
        this.shadowText.z = layout.z.CURRENT_ACTION;

        this.text = this.phaserGame.add.bitmapText(
            layout.CURRENT_ACTION_POSITION.x,
            layout.CURRENT_ACTION_POSITION.y,
            'font_32_white',
            '',
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
        this.text.fixedToCamera = true;
        this.phaserGame.$$mainGroup.add(this.shadowText);
        this.shadowText.z = layout.z.CURRENT_ACTION + 1;
    }

    _updateText() {
        let newText = this._getVerbText() + this._getSelectedThingText() + ' ' + this._getThingText();
        this._setText(newText);
    }

    _setText(newText) {
        if (this._oldText !== newText) {
            this._oldText = newText;
            this.text.setText(newText);
            this.shadowText.setText(newText);
        }
    }

    _getVerbText() {
        let verb = selectedVerb.verb;
        let text = '';
        if (verb && verb.label) {
            text = labels.l(verb.label);
        }
        return text;
    }

    _getThingText() {
        let thing = highlightedThing.thing;
        let text = '';
        if (thing && thing.name) {
            text = labels.l(thing.name);
        }
        return text;
    }

    _getSelectedThingText() {
        let verb = selectedVerb.verb;
        if (!verb.singleObject && selectedThing.thing) {
            return ' ' + labels.l(selectedThing.thing.name) + ' ' + labels.l(verb.conjuction);
        } else {
            return '';
        }
    }
}

module.exports = UICurrentAction;