/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { IPoint } from '../utils/Interfaces';
import { uiLayers } from '../ui/UILayers.singleton';

interface IThingOptions {
    id: string,
    name: string,
    x?: number,
    y?: number,
    directlyInInventory?: Boolean,
    spriteId?: string,
    inventoryImageId?: string,
    goToPosition?: IPoint,
    isForeground?: Boolean
}

export class Thing {

    private state: Map<string, any>;
    private sprite: Phaser.Sprite;

    constructor(private options: IThingOptions) {
        this.state = new Map();

        if (this.options.directlyInInventory) {
            this.addToInventory();
        }
    }

    show(): void {
        this.createSprite();
        // this.onStateChange();
        // this.applyModifier();
    }

    destroy(): void {
        this.sprite.destroy();
    }

    private addToInventory(): void {
        //TODO
    }

    private createSprite(): void {
        let layerToUser = uiLayers.backgroundObjects;
        if (this.options.isForeground) {
            layerToUser = uiLayers.foregroundObjects;
        }
        this.sprite = layerToUser.create(
            this.options.x,
            this.options.y,
            this.options.spriteId
        );

        this.sprite.inputEnabled = true;

        // TODO: events
        // this.sprite.events.onInputDown.add(this._onClick, this);
        // this.sprite.events.onInputOver.add(this._onInputOver, this);
        // this.sprite.events.onInputOut.add(this._onInputOut, this);
    }
}