var Thing = require('../engine/Thing.js');
var Verbs = require('../engine/Verbs.js');

class BackstageDoorToStreet extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 150,
            y: 95,
            spriteId: 'door_sprite',
            goToPosition: {
                x: 175,
                y: 165
            }
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
            player.goToThing(this)
                .then(() => this._open(player));
            break;
        case Verbs.CLOSE:
            player.goToThing(this)
                .then(() => this._close(player));
            break;
        case Verbs.LOOK:
            player.say('That\'s a wonderful door. So woody.');
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