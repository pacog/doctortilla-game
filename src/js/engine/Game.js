var GraphicUI = require('./GraphicUI.js');
var actionDispatcher = require('./ActionDispatcher.singleton.js');
var actions = require('./Actions.singleton.js');
var selectedVerb = require('./SelectedVerb.singleton.js');
var currentScene = require('./CurrentScene.singleton.js');

class Game {

    constructor(phaserGame, options) {

        this.options = options;
        this.phaserGame = phaserGame;

        this._createScenes();
        this._createPlayer();
        this._createUI();

        actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
        actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._applyActionToThing(thing) );
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

    _createPlayer() {
        this.player = new this.options.player(this.phaserGame);
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
