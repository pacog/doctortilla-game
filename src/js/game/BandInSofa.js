var Thing = require('../engine/models/Thing.js');
var ConversationWithBand = require('./ConversationWithBand.js');
var TalkerModifier = require('../engine/models/TalkerModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class BandInSofa extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 434,
            y: 116,
            spriteId: 'BAND_IN_SOFA_SPRITE',
            name: 'bandInSofa',
            goToPosition: {
                x: 410,
                y: 186
            }
        };
        super(phaserGame, options);
    }

    lookAction(player) {
        player.say('There is my band.');
    }

    speakAction(player) {
        player.goToThing(this).then(
            () => new ConversationWithBand(this.phaserGame, player, this)
        );
    }
}

compositionFactory.applyModifier(TalkerModifier, BandInSofa);

module.exports = BandInSofa;