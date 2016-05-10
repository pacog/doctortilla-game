var actions = require('./Actions.singleton.js');

class ActionDispatcher {

    constructor() {
    }

    execute(action, params) {
        switch (action) {

        case actions.SELECT_VERB:
            this._selectVerb(params);
            break;
        default:
            this._showUnknowActionError(action);
            break;
        }
    }

    _showUnknowActionError(action) {
        throw 'ERROR: executing incorrect action ' + action;
    }

    _selectVerb(verb) {
        console.log(verb.label);
    }
}

let actionDispatcherInstance = new ActionDispatcher();
module.exports = actionDispatcherInstance;