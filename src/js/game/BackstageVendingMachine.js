var Thing = require('../engine/models/Thing.js');

class BackstageVendingMachine extends Thing {
    constructor(phaserGame, state) {
        let options = {
            x: 54,
            y: 131,
            spriteId: 'vending',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(phaserGame, options, state);
    }

    pushAction(player) {
        if (this.getAttr('PUSHED')) {
            player.say('I already pushed too much');
        } else {
            player.goToThing(this)
                .then(() => {
                    player.say('Aaaaaragahgahghghghghg');
                    this.changeAttr('PUSHED', true);
                });
        }
    }

    _onStateChange() {
        if (this.getAttr('PUSHED')) {
            this.sprite.x = 84;
            this.sprite.y = 124;
        }
    }
}

module.exports = BackstageVendingMachine;