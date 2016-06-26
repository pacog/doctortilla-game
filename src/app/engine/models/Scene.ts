import { uiLayers } from '../ui/UILayers.singleton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { IRectangle } from '../utils/Interfaces';
import { SceneBoundaries, IBoundariesConfig } from './SceneBoundaries';
import { Thing } from './Thing';


interface ISceneOptions {
    id: string,
    backgroundId: string,
    boundariesConfig: IBoundariesConfig,
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

        // uiLayers.background.sort('z', Phaser.Group.SORT_ASCENDING);
        // uiLayers.backgroundObjects.sort('z', Phaser.Group.SORT_ASCENDING);
        // uiLayers.foregroundObjects.sort('z', Phaser.Group.SORT_ASCENDING);
    }

    destroy(): void {
        this.background.destroy();
        this.things.forEach(thing => thing.destroy());
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

}