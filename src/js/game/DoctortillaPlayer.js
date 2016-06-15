var Player = require('../engine/models/Player.js');
var randomText = require('../engine/models/RandomText.singleton.js');
var activeInventory = require('../engine/state/ActiveInventory.singleton.js');

class DoctortillaPlayer extends Player {

    constructor(phaserGame) {

        let spriteOptions = new Map();

        spriteOptions.set('stand_right', { frames: [0]});
        spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6]});
        spriteOptions.set('stand_left', { frames: [0], inverse: true});
        spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
        spriteOptions.set('stand_up', { frames: [14]});
        spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20]});
        spriteOptions.set('stand_down', { frames: [7]});
        spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13]});

        let options = {
            SPRITE_ID: 'vaca_sprite',
            INITIAL_X: 200,
            INITIAL_Y: 200,
            X_SPEED: 80, //px/s
            Y_SPEED: 55, //px/s
            ANIMATION_SPEED: 6,
            SPRITE_OPTIONS: spriteOptions
        };
        super(phaserGame, options);
    }

    reflect(gameState) {
        console.log(gameState);
        this.say(randomText.r(
            'Now I should say something smart that helps',
            'This is a pretty nice room',
            'Man, I really want to play that concert',
            'Probably I should find the rest of the band...'
        ));
    }

    hasCompleteCostume() {
        let inventory = activeInventory.getActiveInventory();
        let costume = inventory.getById('costume');

        return costume && costume.isComplete();
    }

    hasCable() {
        let inventory = activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        return !!cable;
    }

    hasFunnyDrink() {
        let inventory = activeInventory.getActiveInventory();
        let glass = inventory.getById('glass');
        return glass && glass.isFunny();
    }

    removeCostume() {
        let inventory = activeInventory.getActiveInventory();
        let costume = inventory.getById('costume');
        inventory.remove(costume);
    }

    removeCable() {
        let inventory = activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        inventory.remove(cable);
    }

    removeGlass() {
        let inventory = activeInventory.getActiveInventory();
        let glass = inventory.getById('glass');
        inventory.remove(glass);
    }

    deliveredEverything() {
        return this.getAttr('DELIVERED_CABLE') && this.getAttr('DELIVERED_COSTUME') && this.getAttr('DELIVERED_DRINK');
    }

}

module.exports = DoctortillaPlayer;