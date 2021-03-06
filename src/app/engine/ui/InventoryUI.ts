import { layout } from './LayoutManager.singleton';
import { uiLayers } from './UILayers.singleton';
import { InventoryItemUI } from './InventoryItemUI';
import { activeInventory } from '../state/ActiveInventory.singleton';
import { Inventory } from '../models/Inventory';
import { PaginationButtonType, InventoryPaginationButton } from './InventoryPaginationButton';

const ITEMS_PER_PAGE = 6;

export class InventoryUI {

    private currentPage: number;
    private items: Set<InventoryItemUI>;
    private currentInventory: Inventory;
    private paginationButtonUp: InventoryPaginationButton;
    private paginationButtonDown: InventoryPaginationButton;

    constructor() {
        this.currentPage = 0;
        this.createBackground();
        this.createPaginationButtons();
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

    private createPaginationButtons(): void {
        this.paginationButtonUp = new InventoryPaginationButton({type: PaginationButtonType.UP });
        this.paginationButtonDown = new InventoryPaginationButton({type: PaginationButtonType.DOWN });

        this.paginationButtonUp.subscribeToClick(() => {
            this.goToPrevPage();
        });

        this.paginationButtonDown.subscribeToClick(() => {
            this.goToNextPage();
        });
    }

    private createItems(): void {
        this.destroyPrevItems();
        this.makeSurePageIsInsideInv();

        let index = 0;
        let arrayOfThings = Array.from(this.currentInventory.items);
        let firstPageElement = ITEMS_PER_PAGE * this.currentPage;
        let nextPageFirstElement = ITEMS_PER_PAGE * (this.currentPage + 1);
        for(let i = firstPageElement; (i < nextPageFirstElement) && (i < arrayOfThings.length); i++) {
            this.items.add(
                new InventoryItemUI({
                    thing: arrayOfThings[i],
                    index: index
                })
            );
            index += 1;
        }

        this.showOrHideNavButtons();
    }

    private showOrHideNavButtons(): void {
        if(this.canGoToPrevPage()) {
            this.paginationButtonUp.show();
        } else {
            this.paginationButtonUp.hide();
        }

        if(this.canGoToNextPage()) {
            this.paginationButtonDown.show();
        } else {
            this.paginationButtonDown.hide();
        }
    }

    private destroyPrevItems(): void {
        this.items.forEach(item => item.destroy());
        this.items.clear();
    }

    private goToNextPage(): void {
        if(this.canGoToNextPage()) {
            this.currentPage++;
            this.createItems();
        }
    }

    private canGoToPrevPage(): Boolean {
        return this.currentPage > 0;
    }

    private canGoToNextPage(): Boolean {
        return this.currentInventory.items.size > (ITEMS_PER_PAGE * (this.currentPage + 1));
    }

    private makeSurePageIsInsideInv(): void {
        let firstPageElement = ITEMS_PER_PAGE * this.currentPage;
        if(firstPageElement >= this.currentInventory.items.size) {
            this.currentPage = 0;
        }
    }

    private goToPrevPage(): void {
        if(this.canGoToPrevPage()) {
            this.currentPage--;
            this.createItems();
        }
    }
}