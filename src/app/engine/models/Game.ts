import { labelsStore } from '../stores/Labels.store';
import { Player } from './Player';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Scene } from './Scene';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';

export interface IGameOptions {
    labels: Object,
    player: Player,
    scenes: Array<Scene>,
    initialSceneId: string
}

export abstract class Game {

    player: Player;
    scenes: Map<string, Scene>;
    currentScene: Scene;

    constructor(protected options: IGameOptions) {
        labelsStore.addLabels(this.options.labels);
        this.player = this.options.player;
        activeInventory.setActiveInventory(this.player.inventory);
        this.createScenes(this.options);
        this.initActions();
        // this._createScenes();
        // this._updateWorldBounds();
        // this._createCamera();
        // this._createUI();
    }

    update(): void {}




    //TODO: separate all scenes handling into a Scenes Store?
    private createScenes(options: IGameOptions): void {
        this.scenes = new Map();
        options.scenes.forEach((scene) => {
            this.scenes.set(scene.id, scene);
        });
        this.setCurrentScene(options.initialSceneId);
    }

    private setCurrentScene(currentSceneId: string): void {
        this.destroyCurrentScene();
        let scene = this.scenes.get(currentSceneId);
        if (!scene) {
            throw `ERROR trying to init scene that is not present (${currentSceneId})`;
        }
        scene.show();
    }

    private destroyCurrentScene(): void {
        if (this.currentScene) {
            this.currentScene.destroy();
            this.currentScene = null;
        }
    }

    private initActions(): void {
        actionDispatcher.subscribeTo(Actions.CLICK_STAGE, ev => this.movePlayerTo(ev) );
        // actionDispatcher.subscribeTo(actions.SELECT_THING, thing => this._selectThing(thing) );
        // actionDispatcher.subscribeTo(actions.GO_TO_SCENE, options => this._goToScene(options) );
        // actionDispatcher.subscribeTo(actions.TAKE_OBJECT, thing => this._takeObject(thing) );
        // actionDispatcher.subscribeTo(actions.REFLECT, () => this._reflect() );
    }

    private movePlayerTo(event: Phaser.Pointer): void {
        //TODO: get safe position here from current scene
        this.player.moveTo({
            x: event.worldX,
            y: event.worldY
        });
    }



}