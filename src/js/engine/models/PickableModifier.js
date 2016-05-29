'use strict';
var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');

const PickableModifier = {
    methods: {
        _getTakenBy(player) {
            player.goToThing(this)
            .then(() => {
                actionDispatcher.execute(actions.TAKE_OBJECT, this);
            });
        }
    }
};

module.exports = PickableModifier;