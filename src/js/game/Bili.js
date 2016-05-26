var Thing = require('../engine/models/Thing.js');
var ConversationWithBili = require('./ConversationWithBili.js');
var TalkerModifier = require('../engine/models/TalkerModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class Bili extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 274,
            y: 151,
            spriteId: 'monigote',
            name: 'bili',
            goToPosition: {
                x: 260,
                y: 215
            }
        };
        super(phaserGame, options);
    }

    lookAction(player) {
        player.say('El bili!');
    }

    speakAction(player) {
        player.goToThing(this).then(
            () => new ConversationWithBili(this.phaserGame, player, this)
        );
    }
}

compositionFactory.applyModifier(TalkerModifier, Bili);

module.exports = Bili;