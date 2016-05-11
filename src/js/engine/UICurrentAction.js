var selectedVerb = require('./SelectedVerb.singleton.js');

class UICurrentAction {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        selectedVerb.subscribeToChange(newVerb => console.log(newVerb));
    }
}

module.exports = UICurrentAction;