var Thing = require('../engine/models/Thing.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');
var TalkerModifier = require('../engine/models/TalkerModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var Can = require('./Can.js');
var uiBlocker = require('../engine/ui/UIBlocker.singleton.js');

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
            this._greaseWithBacon(player);
        } else if (selectedThing.thing.id === 'coin') {
            this._getCan(player, selectedThing.thing);
        } else {
            player.say('I don\t know how to use that with a vending machine...');
        }
    }

    _greaseWithBacon(player) {
        player.goToThing(this)
            .then(() => {
                this.changeAttr('GREASED', true);
                player.say('Nice, it will slide really well now...');
            });
    }

    _getCan(player, coin) {
        uiBlocker.block(this.phaserGame);
        player.goToThing(this)
            .then(() => {
                coin.destroy();
                return this.say('Clonk\n   clonk\n      clonk');
            })
            .then(() => {
                new Can(this.phaserGame);
                player.say('That was a wise purchase');
                uiBlocker.unblock(this.phaserGame);
            });
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

compositionFactory.applyModifier(TalkerModifier, BackstageVendingMachine);

module.exports = BackstageVendingMachine;