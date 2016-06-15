var UIConversation = require('../ui/UIConversation.js');

class Conversation {

    constructor(phaserGame, player, otherPerson) {
        this.phaserGame = phaserGame;
        this.player = player;
        this.otherPerson = otherPerson;
        this._loadScript();
        this._stateChangeSubscribers = new Set();
        this._initState();
        this._createConversationUI();
    }

    onStateChange(callback) {
        this._stateChangeSubscribers.add(callback);
        callback(this.state);
    }

    _notifyStateChange() {
        for (let callback of this._stateChangeSubscribers) {
            callback(this._stateId);
        }
    }

    get state() {
        return this._stateId;
    }

    getLines() {
        let currentState = this.state;
        if (!this.script || !this.script[currentState]) {
            throw 'ERROR, there are no lines for this state of conversation';
        }
        return this.script[currentState];
    }

    set state(newState) {
        if (newState === 'end') {
            this.ui.destroy();
        } else {
            this._stateId = newState;
            this._loadScript();
            this._notifyStateChange();
        }
    }

    applyLine(line) {
        line.afterCallback(this.player, this.otherPerson)
            .then(() => {
                this.state = line.nextState;
            });
    }

    getTextForLine(line) {
        return line.text();
    }

    _loadScript() {
        throw 'ERROR: conversations must implement _loadScript method';
    }

    _initState() {
        throw 'ERROR: conversations must implement _initState method to set initial state';
    }

    _createConversationUI() {
        this.ui = new UIConversation(this.phaserGame, this);
    }

}

module.exports = Conversation;