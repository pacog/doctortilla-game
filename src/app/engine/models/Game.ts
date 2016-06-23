import { labelsStore } from '../stores/Labels.store';
import { Player } from './Player';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Scene } from './Scene';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { phaserGame } from '../state/PhaserGame.singleton';
import { GraphicUI } from '../ui/GraphicUI';
import { GameCamera } from './GameCamera';

export interface IGameOptions {
    labels: Object,
    player: Player,
    scenes: Array<Scene>,
    initialSceneId: string
}

export abstract class Game {

    private player: Player;
    private scenes: Map<string, Scene>;
    private currentScene: Scene;
    private camera: GameCamera;
    
    private graphicUI: GraphicUI;

    constructor(protected options: IGameOptions) {
        labelsStore.addLabels(this.options.labels);
        this.player = this.options.player;
        activeInventory.setActiveInventory(this.player.inventory);
        this.createScenes(this.options);
        this.initActions();
        this.updateWorldBounds();
        this.camera = new GameCamera(this.player);
        this.graphicUI = new GraphicUI();
    }

    update(): void {
        this.camera.updatePosition();
    }

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
        this.currentScene = scene;
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
        let nonSafePosition = {
            x: event.worldX,
            y: event.worldY
        };
        let safePosition = this.currentScene.boundaries.getPositionInside(nonSafePosition);
        this.player.moveTo(safePosition);
    }

    private updateWorldBounds(): void {
        let bounds = this.currentScene.sceneBounds;
        phaserGame.value.world.setBounds(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height);
    }

}