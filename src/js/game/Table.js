var Thing = require('../engine/models/Thing.js');
var JustDecorationModifier = require('../engine/models/JustDecorationModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');

class Table extends Thing {
    constructor(phaserGame) {
        let options = {
            x: 93,
            y: 130,
            spriteId: 'table',
            inventoryImageId: 'table',
            name: 'table'
        };
        super(phaserGame, options);
    }

}

compositionFactory.applyModifier(JustDecorationModifier, Table);

module.exports = Table;