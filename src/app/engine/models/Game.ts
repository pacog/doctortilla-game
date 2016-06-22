import { labelsStore } from '../stores/Labels.store';
import { Player } from './Player';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Scene } from './Scene';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { phaserGame } from '../state/PhaserGame.singleton';
import { IPoint } from '../utils/Interfaces';
import { style } from '../ui/Style';

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
    private camera: Phaser.Camera;
    private cameraPosition: IPoint;

    constructor(protected options: IGameOptions) {
        labelsStore.addLabels(this.options.labels);
        this.player = this.options.player;
        activeInventory.setActiveInventory(this.player.inventory);
        this.createScenes(this.options);
        this.initActions();
        this.updateWorldBounds();
        this.createCamera();
        // this._createUI();
    }

    update(): void {
        this.updateCameraPosition();
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


    //TODO separate camera into a new module
    private createCamera(): void {
        if (!this.player) {
            throw 'ERROR: camera must be created after player';
        }
        this.camera = phaserGame.value.camera;
        this.updateCameraPosition();
    }

    private updateCameraPosition(): void {
        this.cameraPosition = this.cameraPosition || new Phaser.Point(0, 0);

        let player = this.player.sprite;
        this.cameraPosition.x += (player.x - this.cameraPosition.x) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.x = Math.round(this.cameraPosition.x);
        this.cameraPosition.y += (player.y - this.cameraPosition.y) * style.CAMERA_EASING_FACTOR;
        this.cameraPosition.y = Math.round(this.cameraPosition.y);
        this.camera.focusOnXY(this.cameraPosition.x, this.cameraPosition.y);
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

    private updateWorldBounds(): void {
        let bounds = this.currentScene.sceneBounds;
        phaserGame.value.world.setBounds(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height);
    }

}