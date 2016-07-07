/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { IPoint } from '../utils/Interfaces';
import { uiLayers } from '../ui/UILayers.singleton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Verbs } from '../stores/Verbs.store';
import { phaserGame } from '../state/PhaserGame.singleton';
import { Player } from './Player';


interface IThingOptions {
    id: string,
    name: string,
    x?: number,
    y?: number,
    directlyInInventory?: Boolean,
    spriteId?: string,
    inventoryImageId?: string,
    goToPosition?: IPoint,
    isForeground?: Boolean,
    preferredAction?: Verbs,
    pickable?: Boolean
}

export abstract class Thing {

    private _state: Map<string, any>;
    protected sprite: Phaser.Sprite;

    constructor(protected options: IThingOptions) {
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

    get id(): string {
        return this.options.id;
    }

    changeAttr(attrName: string, value: any) {
        this._state.set(attrName, value);
        this.onStateChange();
    }

    getAttr(attrName: string): any {
        return this._state.get(attrName);
    }

    getPreferredAction(): Verbs {
        return this.options.preferredAction || null;
    }

    isInInventory(): Boolean {
        return this.state && this.state.get('IS_IN_INVENTORY');
    }

    getPositionToGoTo(): IPoint {
        if (this.options.goToPosition) {
            return this.options.goToPosition;
        } else {
            return {
                x: this.options.x,
                y: this.options.y
            };
        }
    }

    getPositionOnTop(): IPoint{
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }

    applyAction(verb: Verbs, player: Player): void {
        switch (verb) {

        case Verbs.GO_TO:
            if (!this.isInInventory()) {
                this.goToAction(player);
            }
            break;
        case Verbs.TAKE:
            this.takeAction(player);
            break;
        case Verbs.LOOK:
            this.lookAction(player);
            break;
        case Verbs.OPEN:
            this.openAction(player);
            break;
        case Verbs.CLOSE:
            this.closeAction(player);
            break;
        case Verbs.PUSH:
            this.pushAction(player);
            break;
        case Verbs.USE:
            this.useAction(player);
            break;
        case Verbs.SPEAK:
            this.speakAction(player);
            break;
        case Verbs.GIVE:
            this.giveAction(player);
            break;
        default:
            throw 'ERROR, unknown action ' + verb;
        }
    }

    get inventoryImage(): string {
        return this.options.inventoryImageId || this.options.spriteId;
    }

    destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
        }
        if(this.isInInventory) {
            activeInventory.getActiveInventory().remove(this);
        }
    }

    // Methods that can be overwritten in subclasses
    getFrameForInventory(): number {
        return 0;
    }

    protected onStateChange(): void {};
    protected applyModifier(): void {};

    protected goToAction(player: Player): void {
        player.goToThing(this);
    }

    protected takeAction(player: Player): void  {
        if (!this.options.pickable) {
            
        } else if(this.isInInventory()) {
            player.say('I already have it');
        } else {
            player.goToThing(this)
                .then(() => {
                    actionDispatcher.execute(Actions.TAKE_OBJECT, this);
                });
        }
    }

    protected lookAction(player: Player): void  {
        //TODO: check if there are look options
        player.say('That is pretty neat');
    }

    protected openAction(player: Player): void  {
        player.say('That cannot be opened');
    }

    protected closeAction(player: Player): void  {
        player.say('That cannot be closed');
    }

    protected pushAction(player: Player): void  {
        player.say('I cannot move that');
    }

    protected useAction(player: Player): void  {
        player.say('I do not know how to use that');
    }

    protected speakAction(player: Player): void  {
        player.say('I wouldn\'t know what to say');
    }

    protected giveAction(player: Player): void  {
        player.say('I cannot do that');
    }


    //Methods that shouldn't be overriden
    private addToInventory(): void {
        if(activeInventory.getActiveInventory()) {
            activeInventory.getActiveInventory().add(this);
        }
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