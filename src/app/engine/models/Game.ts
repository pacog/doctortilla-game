export interface IGameOptions {
    // player: string
}

export abstract class Game {

    constructor(protected options: IGameOptions) {
        this.options = options;
        // this.phaserGame = phaserGame;
        // this.phaserGame.$$mainGroup = this.phaserGame.add.group();
        // labels .setLabels(this.options.labels);
        // this._createPlayer();
        // this._createScenes();
        // this._updateWorldBounds();
        // this._createCamera();
        // this._createUI();
        // this.player.bringToTop();

        // actionDispatcher.subscribeTo(actions.CLICK_STAGE, ev => this._movePlayerTo(ev) );
        // actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._selectThing(thing) );
        // actionDispatcher.subscribeTo(actions.GO_TO_SCENE, options => this._goToScene(options) );
        // actionDispatcher.subscribeTo(actions.TAKE_OBJECT, thing => this._takeObject(thing) );
        // actionDispatcher.subscribeTo(actions.REFLECT, () => this._reflect() );
    }

    update() {}
}