import { uiLayers } from '../ui/UILayers.singleton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { IRectangle, IPoint } from '../utils/Interfaces';
import { Polygon } from '../utils/Polygon';
import { SceneBoundaries } from './SceneBoundaries';
import { Thing } from './Thing';
import { Player } from './Player';
import { Door } from './Door';


interface ISceneOptions {
    id: string,
    backgroundId: string,
    boundariesConfig: Polygon,
    things: Array<Thing>
}

export abstract class Scene {

    private background: Phaser.Sprite;
    private _boundaries: SceneBoundaries;
    private things: Set<Thing>;

    constructor(private options: ISceneOptions) {
        this._boundaries = new SceneBoundaries(options.boundariesConfig);
        this.createThings();
    }

    get id(): string {
        return this.options.id;
    }

    get sceneBounds(): IRectangle {
        return this.background.getBounds();
    }

    get boundaries(): SceneBoundaries {
        return this._boundaries;
    }

    show(): void {
        this.createBackground();
        this.things.forEach(thing => thing.show());
        this._boundaries.paint();
    }

    removeObject(objectToRemove: Thing): void {
        this.things.delete(objectToRemove);
        objectToRemove.destroy();
    }

    playerArrivesAtDoor(player: Player, doorId: string): void {
        let door = this.findDoor(doorId);
        door.forceOpen();
        player.teleportTo(door.getPositionToGoTo());
    }

    getThingById(thingId: string): Thing {
        var foundThing: Thing = null;
        this.things.forEach((thing) => {
            if (thing.id === thingId) {
                foundThing = thing;
            }
        });
        return foundThing;
    }

    destroy(): void {
        this.background.destroy();
        this.things.forEach(thing => thing.destroy());
        this._boundaries.unpaint();
    }

    private createBackground() {
        this.background = uiLayers.background.create(0, 0, this.options.backgroundId);
        this.background.anchor.set(0, 0);
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add( (dest: any, ev: any) => {
            actionDispatcher.execute(Actions.CLICK_STAGE, ev);
        });

    }

    private createThings() {
        this.things = new Set();
        this.options.things.forEach((thing) => this.things.add(thing));
    }

    private findDoor(doorId: string): Door {
        for (let thing of this.things) {
            if (thing.id === doorId) {
                return <Door>thing;
            }
        }
        throw 'ERROR: could not find the related door.';
    }

}