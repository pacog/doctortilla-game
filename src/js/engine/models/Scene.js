var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');
var layout = require('../ui/LayoutManager.singleton.js');

class Scene {

    constructor(phaserGame, options, state) {
        this.options = options;
        this.options.state = state;

        this.phaserGame = phaserGame;
        this._createBackground();
        this._createBoundaries();
        this._createThings();
        this._sortSceneObjects();
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
        return {
            scene: this._getSelfState(),
            objects: this._getObjectsState()
        };
    }

    getThingById(thingId) {
        var foundThing = null;
        this._things.forEach((thing) => {
            if (thing.id === thingId) {
                foundThing = thing;
            }
        });
        return foundThing;
    }

    _getSelfState() {
        return {};
    }

    _getObjectsState() {
        let result = new Map();
        this._things.forEach((thing) => {
            result.set(thing.constructor.name, thing.state);
        });
        return result;
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
        this.background = this.phaserGame.$$mainGroup.create(
                    0,
                    0,
                    this.options.BG);
        this.background.anchor.setTo(0, 0);
        this.background.z = layout.z.BACKGROUND;
        this.phaserGame.$$mainGroup.sort('z', Phaser.Group.SORT_ASCENDING);
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
            if (this._shouldCreateThing(things[i])) {
                let thingToAdd = new things[i](this.phaserGame);
                thingToAdd.state = this._getObjectState(things[i]);
                this._things.add(thingToAdd);
            }
        }
    }

    _shouldCreateThing(thingClass) {
        if (!this.options.state) {
            return true;
        }
        if (this._getObjectState(thingClass)) {
            return true;
        }
        return false;
    }

    _getObjectState(thingClass) {
        if (!this.options.state) {
            return undefined;
        }
        return this.options.state.objects.get(thingClass.name);
    }

    _findDoor(doorId) {
        for (let thing of this._things) {
            if (thing.id === doorId) {
                return thing;
            }
        }
        throw 'ERROR: could not find the related door.';
    }

    _sortSceneObjects() {
        this.phaserGame.$$mainGroup.sort('z', Phaser.Group.SORT_ASCENDING);
        //TODO: should reduce z index if needed
    }

    destroy() {
        this.background.destroy();
        this._things.forEach(thing => thing.destroy());
    }
}

module.exports = Scene;
