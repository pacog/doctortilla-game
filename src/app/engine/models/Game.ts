import { labelsStore } from '../stores/Labels.store';
import { Player } from './Player';
import { Thing } from './Thing';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Scene } from './Scene';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { phaserGame } from '../state/PhaserGame.singleton';
import { GraphicUI } from '../ui/GraphicUI';
import { GameCamera } from './GameCamera';
import { selectedVerb } from '../state/SelectedVerb.singleton';
import { VerbsInfo } from '../stores/Verbs.store';
import { selectedThing } from '../state/SelectedObjects';
import { scenes } from '../state/Scenes.singleton';
import { IGoToSceneOptions } from '../utils/Interfaces';

export interface IGameOptions {
    labels: Object,
    player: Player,
    scenes: Array<Scene>,
    initialSceneId: string
}

export abstract class Game {

    private player: Player;
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

    private createScenes(options: IGameOptions): void {
        scenes.init(options.scenes);
        scenes.setCurrentSceneById(options.initialSceneId);
    }

    private initActions(): void {
        actionDispatcher.subscribeTo(Actions.CLICK_STAGE, ev => this.movePlayerTo(ev) );
        actionDispatcher.subscribeTo(Actions.SELECT_THING, thing => this.selectThing(thing) );
        actionDispatcher.subscribeTo(Actions.GO_TO_SCENE, options => this.goToScene(options) );
        actionDispatcher.subscribeTo(Actions.TAKE_OBJECT, thing => this.takeObject(thing) );
        actionDispatcher.subscribeTo(Actions.REFLECT, () => this.reflect() );
    }

    private movePlayerTo(event: Phaser.Pointer): void {
        let nonSafePosition = {
            x: event.worldX,
            y: event.worldY
        };
        let safePosition = scenes.currentScene.boundaries.getPositionInside(nonSafePosition);
        this.player.moveTo(safePosition);
    }

    private updateWorldBounds(): void {
        let bounds = scenes.currentScene.sceneBounds;
        phaserGame.value.world.setBounds(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height);
    }

    private selectThing(thing: Thing): void {
        var verb = VerbsInfo.get(selectedVerb.verb);
        if (verb.singleObject) {
            thing.applyAction(selectedVerb.verb, this.player);
            actionDispatcher.execute(Actions.ACTION_APPLIED);
        } else {
            this.selectThingForMultipleObjectVerb(thing);
        }
    }

    private takeObject(thing: Thing): void {
        scenes.currentScene.removeObject(thing);
        this.player.addObjectToInventory(thing);
        actionDispatcher.execute(Actions.UPDATE_INVENTORY);
    }

    private selectThingForMultipleObjectVerb(thing: Thing): void {
        if (selectedThing.thing) {
            thing.applyAction(selectedVerb.verb, this.player);
            actionDispatcher.execute(Actions.ACTION_APPLIED);
        } else {
            if (thing.isInInventory()) {
                selectedThing.thing = thing;
            }
        }
    }

    private goToScene(options: IGoToSceneOptions) {
        scenes.goToSceneWithId(options.sceneId);
        scenes.currentScene.playerArrivesAtDoor(this.player, options.relatedDoorId);
    }

    private reflect(): void {
        this.player.reflect();
    }

}