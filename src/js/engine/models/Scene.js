var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');

class Scene {

    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this._createBackground();
        this._createBoundaries();
        this._createThings();
    }

    get id() {
        return this.options.id;
    }

    get boundaries() {
        return this._boundaries;
    }

    get sceneBounds() {
        return this.background.getBounds();
    }

    get state() {
        return {};
    }

    playerArrivesAtDoor(player, doorId) {
        let door = this._findDoor(doorId);
        door.forceOpen();
        player.teletransportTo(door);
    }

    removeObject(thing) {
        this._things.delete(thing);
        thing.destroy();
    }

    _createBackground() {
        this.background = this.phaserGame.add.sprite(
                    0,
                    0,
                    this.options.BG);
        this.background.anchor.setTo(0, 0);

        this.background.inputEnabled = true;
        this.background.pixelPerfectClick = true;
        this.background.events.onInputDown.add( (dest, ev) => {
            actionDispatcher.execute(actions.CLICK_STAGE, ev);
        });
        this.background.sendToBack();
    }

    _createBoundaries() {
        this._boundaries = new this.options.boundaries();
    }

    _createThings() {
        this._things = new Set();
        var things = this.options.things || [];
        for (let i = 0; i < things.length; i++) {
            this._things.add(new things[i](this.phaserGame));
        }
    }

    _findDoor(doorId) {
        for (let thing of this._things) {
            if (thing.id === doorId) {
                return thing;
            }
        }
        throw 'ERROR: could not find the related door.';
    }

    destroy() {
        this.background.destroy();
        this._things.forEach(thing => thing.destroy());
    }
}

module.exports = Scene;
