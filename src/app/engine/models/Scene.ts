import { uiLayers } from '../ui/UILayers.singleton';

interface ISceneOptions {
    id: string,
    backgroundId: string
}

export abstract class Scene {
    private background: Phaser.Sprite;

    constructor(private options: ISceneOptions) {
        this.createBackground();
    }

    get id(): string {
        return this.options.id;
    }

    show(): void {
        //TODO
    }

    destroy(): void {
        //TODO
    }

    private createBackground() {
        this.background = uiLayers.background.create(0, 0, this.options.backgroundId);
        this.background.anchor.set(0, 0);
        this.background.inputEnabled = true;
        uiLayers.background.sort('z', Phaser.Group.SORT_ASCENDING);
        // this.background.pixelPerfectClick = true;
   // this.background.events.onInputDown.add( (dest, ev) => {
//             actionDispatcher.execute(actions.CLICK_STAGE, ev);
//         });
        // this.background.events.onInputDown.add

    }
}