import { IPoint } from '../utils/Interfaces';

const VERB_BUTTON_HEIGHT: number = 36;
const CURRENT_ACTION_INFO_HEIGHT = 40;
const VERB_BUTTON_WIDTH = 150;
const REFLECT_BUTTON_WIDTH = VERB_BUTTON_WIDTH;

const CURRENT_ACTION_INFO_PADDING_X = 5;
const CURRENT_ACTION_INFO_PADDING_Y = 7;

const VERBS_ROWS = 3;
const VERB_COLUMNS = 3;

const INV_ROWS = 2;
const INV_COLUMNS = 3;
const INV_ITEM_WIDTH = 136;
const INV_ITEM_HEIGHT = 52;

class LayoutManager {

    LAYOUT_WIDTH: number = 1066;
    LAYOUT_HEIGHT: number = 600;
    LAYOUT_ZOOM: number = 2;
    
    LAYOUT_DEFAULT_MARGIN: number = 1;
    VERB_BUTTON_MARGIN: number = this.LAYOUT_DEFAULT_MARGIN;

    get WIDTH(): number {
        return this.LAYOUT_WIDTH / this.LAYOUT_ZOOM;
    }

    get HEIGHT(): number {
        return this.LAYOUT_HEIGHT / this.LAYOUT_ZOOM;
    }

    get VERBS_HEIGHT(): number {
        let marginY = (VERBS_ROWS + 1) * this.VERB_BUTTON_MARGIN;
        let heightY = VERBS_ROWS * this.VERB_BUTTON_HEIGHT;
        return marginY + heightY;
    }

    get VERB_BUTTON_HEIGHT(): number {
        return VERB_BUTTON_HEIGHT / this.LAYOUT_ZOOM;
    }

    get VERBS_Y_START(): number {
        return this.HEIGHT - this.VERBS_HEIGHT;
    }

    get CURRENT_ACTION_INFO_HEIGHT(): number {
        return CURRENT_ACTION_INFO_HEIGHT / this.LAYOUT_ZOOM;
    }

    get UI_START_POSITION(): IPoint {
        return {
            x: 0,
            y: this.VERBS_Y_START - this.CURRENT_ACTION_INFO_HEIGHT
        };
    }

    get VERB_BUTTON_WIDTH() {
        return VERB_BUTTON_WIDTH / this.LAYOUT_ZOOM;
    }

    get REFLECT_BUTTON_WIDTH() {
        return REFLECT_BUTTON_WIDTH / this.LAYOUT_ZOOM;
    }

    get CURRENT_ACTION_POSITION() {
        return {
            x: CURRENT_ACTION_INFO_PADDING_X,
            y: this.HEIGHT - this.VERBS_HEIGHT - this.CURRENT_ACTION_INFO_HEIGHT + CURRENT_ACTION_INFO_PADDING_Y
        };
    }

    get INVENTORY_START_POSITION() {
        return this.getVerbButtonPosition({
            x: VERB_COLUMNS,
            y: 0
        });
    }

    get INV_ITEM_WIDTH() {
        return INV_ITEM_WIDTH / this.LAYOUT_ZOOM;
    }

    get INV_ITEM_HEIGHT() {
        return INV_ITEM_HEIGHT / this.LAYOUT_ZOOM;
    }

    getVerbButtonPosition(verbGridPosition: IPoint): IPoint {
        let marginX = (verbGridPosition.x + 2) * this.VERB_BUTTON_MARGIN;
        let positionX = this.REFLECT_BUTTON_WIDTH + (verbGridPosition.x * this.VERB_BUTTON_WIDTH);

        let marginY = (verbGridPosition.y + 1) * this.VERB_BUTTON_MARGIN;
        let positionY = verbGridPosition.y * this.VERB_BUTTON_HEIGHT;

        return {
            x: marginX + positionX,
            y: this.VERBS_Y_START + marginY + positionY
        };
    }

    getPositionForUIInventoryItem(index: number): IPoint {
        let {column, row} = this.getInventoryItemPosition(index);

        let initialPosition = this.INVENTORY_START_POSITION;

        let marginX = (column + 1) * this.VERB_BUTTON_MARGIN;
        let positionX = column * this.INV_ITEM_WIDTH;

        let marginY = (row + 1) * this.VERB_BUTTON_MARGIN;
        let positionY = row * this.INV_ITEM_HEIGHT;

        return {
            x: marginX + positionX + initialPosition.x,
            y: marginY + positionY + initialPosition.y
        };
    }

    private getInventoryItemPosition(index: number): {column: number, row: number} {
        let column = index % INV_COLUMNS;
        let row = Math.floor(index / INV_COLUMNS);
        return {
            column: column,
            row: row
        };
    }
}

export const layout = new LayoutManager();