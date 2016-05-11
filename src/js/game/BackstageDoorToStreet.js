var Thing = require('../engine/Thing.js');
var Verbs = require('../engine/Verbs.js');

class BackstageDoorToStreet extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 100,
            y: 161,
            spriteId: 'door_sprite'
        };
        super(phaserGame, options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'street';
        } else {
            return 'door to street';
        }
    }

    applyAction(verb, player) {

        switch (verb) {

        case Verbs.GO_TO:
            player.goToThing(this);
            break;
        case Verbs.OPEN:
            this._open(player);
            break;
        case Verbs.CLOSE:
            this._close(player);
            break;
        default:
            //TODO: depending on the verb, do one thing or another
            player.say('I cannot do that');
            break;

        }
    }

    _open(player) {
        if (this.getAttr('OPEN')) {
            player.say('It is already open!');
        } else {
            this.changeAttr('OPEN', true);
        }
    }

    _close(player) {
        if (!this.getAttr('OPEN')) {
            player.say('It is already closed!');
        } else {
            this.changeAttr('OPEN', false);
        }
    }

    _onStateChange() {
        if (this.getAttr('OPEN')) {
            this.sprite.frame = 1;
        } else {
            this.sprite.frame = 0;
        }
    }
}

module.exports = BackstageDoorToStreet;