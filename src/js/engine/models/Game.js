var GraphicUI = require('../ui/GraphicUI.js');
var actionDispatcher = require('../ActionDispatcher.singleton.js');
var actions = require('../stores/Actions.store.js');
var selectedVerb = require('../state/SelectedVerb.singleton.js');
var currentScene = require('../state/CurrentScene.singleton.js');
var style = require('../ui/Style.singleton.js');

class Game {

    constructor(phaserGame, options) {

        this.options = options;
        this.phaserGame = phaserGame;

        this._createScenes();
        this._updateWorldBounds();
        this._createPlayer();
        this._createCamera();
        this._createUI();

        actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
        actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._applyActionToThing(thing) );
        actionDispatcher.subscribeTo(actions.GO_TO_SCENE, options => this._goToScene(options) );
        actionDispatcher.subscribeTo(actions.TAKE_OBJECT, thing => this._takeObject(thing) );
    }

    update() {
        this._updateCameraPosition();
    }

    _createUI() {
        this._graphicUI = new GraphicUI(this.phaserGame);
    }

    _createScenes() {
        this.scenes = this.options.scenes || [];
        this.scenesState = new Map();

        this._createSceneWithId(this.options.firstScene.id);

    }

    _findSceneById(id) {
        for (let i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].id === id) {
                return this.scenes[i];
            }
        }
        throw 'ERROR: could not find scene with that ID ' + id;
    }

    _updateWorldBounds() {
        let bounds = currentScene.value.sceneBounds;
        this.phaserGame.world.setBounds(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height);
    }

    _createPlayer() {
        this.player = new this.options.player(this.phaserGame);
    }

    _createCamera() {
        if (!this.player) {
            throw 'ERROR: camera must be created after player';
        }
        this.camera = this.phaserGame.camera;
        this._updateCameraPosition();
    }

    _updateCameraPosition() {
        this.cameraPosition = this.cameraPosition || new Phaser.Point(0, 0);

        let player = this.player.getPhaserObject();
        this.cameraPosition.x += (player.x - this.cameraPosition.x) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.x = Math.round(this.cameraPosition.x);
        this.cameraPosition.y += (player.y - this.cameraPosition.y) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.y = Math.round(this.cameraPosition.y);
        this.camera.focusOnXY(this.cameraPosition.x, this.cameraPosition.y);
    }

    _movePlayerTo(ev) {
        this.player.moveTo({
            x: ev.x,
            y: ev.y
        });
    }

    _goToScene(options) {
        this._destroyOldScene();
        this._createSceneWithId(options.scene);
        currentScene.value.playerArrivesAtDoor(this.player, options.relatedDoor);
        this._updateWorldBounds();
        this.player.bringToTop();
    }

    _createSceneWithId(id) {
        let SceneClass = this._findSceneById(id);

        let addedScene = new SceneClass(this.phaserGame, this.scenesState.get(SceneClass.id));

        currentScene.value = addedScene;
    }

    _destroyOldScene() {
        let oldScene = currentScene.value;
        this.scenesState.set(oldScene.constructor.id, oldScene.state);
        oldScene.destroy();
    }

    _applyActionToThing(thing) {
        thing.applyAction(selectedVerb.verb, this.player);
        actionDispatcher.execute(actions.ACTION_APPLIED);
    }

    _takeObject(thing) {
        currentScene.value.removeObject(thing);
        this.player.addObjectToInventory(thing);
        actionDispatcher.execute(actions.UPDATE_INVENTORY);
    }
}

module.exports = Game;
