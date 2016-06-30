import { layout } from './LayoutManager.singleton';
import { uiLayers } from './UILayers.singleton';
import { InventoryItemUI } from './InventoryItemUI';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Inventory } from '../models/Inventory';

export class InventoryUI {

    private items: Set<InventoryItemUI>;
    private currentInventory: Inventory;

    constructor() {
        this.createBackground();
        this.items = new Set();
        activeInventory.subscribeToChange((newInventory) => this.inventoryChanged(newInventory))
    }

    // refresh() {
    //     this.inventoryChanged(activeInventory.getActiveInventory());
    // }

    private inventoryChanged(newInventory: Inventory): void {
        this.currentInventory = newInventory;
        this.createItems();
    }

    private createBackground(): void {
        let layoutStartPosition = layout.INVENTORY_START_POSITION;

        let background = uiLayers.verbButtons.create(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_INV_BG');
        background.anchor.setTo(0, 0);
        background.fixedToCamera = true;
    }

    private createItems(): void {
        //TODO: handle order and more than 6 inv items
        this.destroyPrevItems();

        let index = 0;
        for (let thing of this.currentInventory.items) {
            this.items.add(
                new InventoryItemUI({
                    thing: thing,
                    index: index
                })
            );
            index += 1;
        }
    }

    private destroyPrevItems(): void {
        this.items.forEach(item => item.destroy());
        this.items.clear();
    }
}