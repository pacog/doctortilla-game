var GenericHighlightedThing = require('../models/GenericHighlightedThing.js');
var selectedVerb = require('../state/SelectedVerb.singleton.js');
var selectedThing = require('../state/SelectedThing.singleton.js');

class HighlightedThing extends GenericHighlightedThing {


    _onCursorOverThing(thing) {
        if (selectedVerb.verb && selectedVerb.verb.singleObject) {
            this._highlightThing(thing);
        } else if (selectedVerb.verb && !selectedVerb.verb.singleObject) {
            this._highlightThingForMultipleObjectVerb(thing);
        }
        
    }

    _highlightThingForMultipleObjectVerb(thing) {
        if (selectedThing.thing) {
            this._highlightThing(thing);
        } else if (thing.isInInventory()) {
            this._highlightThing(thing);
        }
    }

    _onCursorOutThing() {
        this._highlightThing(null);
    }
}

var highlightedThing = new HighlightedThing();
module.exports = highlightedThing;