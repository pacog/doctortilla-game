/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { IPoint } from '../utils/Interfaces';
import { uiLayers } from '../ui/UILayers.singleton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { activeInventory } from '../state/ActiveInventory.singleton';

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

export abstract class Thing {

    private _state: Map<string, any>;
    private sprite: Phaser.Sprite;

    constructor(private options: IThingOptions) {
        this.state = new Map();

        if (this.options.directlyInInventory) {
            this.addToInventory();
        }
    }

    show(): void {
        this.createSprite();
        this.onStateChange();
        this.applyModifier();
    }

    get state(): Map<string, any> {
        return this._state;
    }

    set state(newState) {
        if (newState) {
            this._state = newState;
            this.onStateChange();
        }
    }

    get name(): string {
        return this.options.name;
    }

    changeAttr(attrName: string, value: any) {
        this._state.set(attrName, value);
        this.onStateChange();
    }

    getAttr(attrName: string): any {
        return this._state.get(attrName);
    }

    destroy(): void {
        this.sprite.destroy();
    }

    // Methods that can be overwritten in subclasses
    private onStateChange(): void {};
    private applyModifier(): void {};


    private addToInventory(): void {
        activeInventory.getActiveInventory().add(this);
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
        this.sprite.events.onInputDown.add(this.onClick, this);
        this.sprite.events.onInputOver.add(this.onInputOver, this);
        this.sprite.events.onInputOut.add(this.onInputOut, this);
    }

    private onClick(): void {
        actionDispatcher.execute(Actions.SELECT_THING, this);
    }

    private onInputOver() {
        actionDispatcher.execute(Actions.CURSOR_OVER_THING, this);
    }

    private onInputOut() {
        actionDispatcher.execute(Actions.CURSOR_OUT_THING, this);
    }
}