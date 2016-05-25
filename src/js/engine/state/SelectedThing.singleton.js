var GenericHighlightedThing = require('../models/GenericHighlightedThing.js');
var actions = require('../stores/Actions.store.js');
var actionDispatcher = require('../ActionDispatcher.singleton.js');

class SelectedThing extends GenericHighlightedThing {
    constructor() {
        super();
        actionDispatcher.subscribeTo(
            actions.ACTION_APPLIED,
            () => this._highlightThing(null)
        );
    }
}

var selectedThing = new SelectedThing();
module.exports = selectedThing;