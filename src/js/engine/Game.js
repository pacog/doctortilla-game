var GraphicUI = require('./GraphicUI.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');
var selectedVerb = require('./SelectedVerb.singleton.js');
var currentScene = require('./CurrentScene.singleton.js');
var style = require('./Style.singleton.js');

class Game {

    constructor(phaserGame, options) {

        this.options = options;
        this.phaserGame = phaserGame;

        this._createScenes();
        this._createWorld();
        this._createPlayer();
        this._createCamera();
        this._createUI();

        

        actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
        actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._applyActionToThing(thing) );
    }

    update() {
        this._updateCameraPosition();
    }

    _createUI() {
        this._graphicUI = new GraphicUI(this.phaserGame);
    }

    _createScenes() {
        var scenes = this.options.scenes || [];

        for (let i = 0; i < scenes.length; i++) {
            if (scenes[i] === this.options.firstScene) {
                let addedScene = new scenes[i](this.phaserGame);
                currentScene.value = addedScene;
            }
        }

    }

    _createWorld() {
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

    _applyActionToThing(thing) {
        thing.applyAction(selectedVerb.verb, this.player);
        actionDispatcher.execute(actions.ACTION_APPLIED);
    }
}

module.exports = Game;
