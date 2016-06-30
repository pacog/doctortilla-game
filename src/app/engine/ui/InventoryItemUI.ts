import { Thing } from '../models/Thing';
import { layout } from './LayoutManager.singleton';
import { uiLayers } from './UILayers.singleton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';

interface IInventoryItemUIOptions {
    thing: Thing,
    index: number
}

export class InventoryItemUI {

    private sprite: Phaser.Sprite;

    constructor(private options: IInventoryItemUIOptions) {
        this.createSprite();
    }

    destroy(): void {
        this.sprite.destroy();
    }

    private createSprite(): void {
        let position = layout.getPositionForUIInventoryItem(this.options.index);
        this.sprite = uiLayers.verbButtons.create(
            position.x,
            position.y,
            this.options.thing.inventoryImage
        );

        this.sprite.inputEnabled = true;
        this.sprite.fixedToCamera = true;

        this.sprite.frame = this.options.thing.getFrameForInventory();

        this.sprite.events.onInputDown.add(this.onClick, this);
        this.sprite.events.onInputOver.add(this.onInputOver, this);
        this.sprite.events.onInputOut.add(this.onInputOut, this);
    }

    private onClick(): void {
        actionDispatcher.execute(Actions.SELECT_THING, this.options.thing);
    }

    private onInputOver(): void {
        actionDispatcher.execute(Actions.CURSOR_OVER_THING, this.options.thing);
    }

    private onInputOut(): void {
        actionDispatcher.execute(Actions.CURSOR_OUT_THING, this.options.thing);
    }

}