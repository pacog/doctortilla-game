import { labelsStore } from '../stores/Labels.store';
import { Player } from './Player';
import { activeInventory } from '../state/ActiveInventory.singleton';


export interface IGameOptions {
    labels: Object,
    player: Player
}

export abstract class Game {

    player: Player;

    constructor(protected options: IGameOptions) {
        labelsStore.addLabels(this.options.labels);

        this.player = this.options.player;
        activeInventory.setActiveInventory(this.player.inventory);

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

    update(): void {}

}