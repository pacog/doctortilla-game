var Thing = require('../engine/models/Thing.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');

const NORMAL_FRAME = 0;
const GREASED_FRAME = 1;
const GREASED_AND_PUSHED_FRAME = 2;

class BackstageVendingMachine extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'vending',
            x: 54,
            y: 131,
            spriteId: 'VENDING_SPRITE',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(phaserGame, options);
    }

    pushAction(player) {
        if (this.getAttr('PUSHED')) {
            return player.say('I already pushed too much');
        } else if (this.getAttr('GREASED')) {
            return player.goToThing(this)
                .then(() => {
                    player.say('Aaaaaragahgahghghghghg');
                    this.changeAttr('PUSHED', true);
                });
        } else {
            return player.goToThing(this)
                .then(() => {
                    return player.say('The floor is so sticky it is impossible to move it.');
                })
                .then(() => {
                    return player.say('If I could just put some grease below it...');
                });
        }
    }

    useAction(player) {
        if (selectedThing.thing.id === 'bacon') {
            this.changeAttr('GREASED', true);
            player.say('Nice, it will slide really well now...');
        } else {
            player.say('I don\t know how to use that with a vending machine...');
        }
    }

    _onStateChange() {
        if (this.getAttr('GREASED')) {
            if (this.getAttr('PUSHED')) {
                this.sprite.frame = GREASED_AND_PUSHED_FRAME;
            } else {
                this.sprite.frame = GREASED_FRAME;
            }
        } else {
            this.sprite.frame = NORMAL_FRAME;
        }
    }
}

module.exports = BackstageVendingMachine;