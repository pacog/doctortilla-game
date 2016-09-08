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

const CONVERSATION_LINE_HEIGHT = CURRENT_ACTION_INFO_HEIGHT;
const CONVERSATION_LINE_PADDING_X = 5;
const CONVERSATION_LINE_PADDING_Y = 6;

const LOGO_SIZE: IPoint = {
    x: 502,
    y: 175
};
const THE_GAME_SIZE: IPoint = {
    x: 150,
    y: 43
};
const LANGUAGE_BUTTON_SIZE: IPoint = {
    x: 136,
    y: 27
};

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

        return this.getInventoryPositionFromRowAndColumn(row, column);
    }

    getReflectButtonPosition() {
        return {
            x: this.LAYOUT_DEFAULT_MARGIN,
            y: this.VERBS_Y_START + this.LAYOUT_DEFAULT_MARGIN
        };
    }

    getReflectButtonSize() {
        return {
            height: this.VERBS_HEIGHT,
            width: this.REFLECT_BUTTON_WIDTH
        };
    }

    get CONVERSATION_LINE_HEIGHT(): number {
        return CONVERSATION_LINE_HEIGHT / this.LAYOUT_ZOOM;
    }

    get CONVERSATION_LINE_PADDING_X(): number {
        return CONVERSATION_LINE_PADDING_X;
    }

    get CONVERSATION_LINE_PADDING_Y(): number {
        return CONVERSATION_LINE_PADDING_Y;
    }

    get LOGO_POSITION(): IPoint {
        return {
            x: Math.round((this.WIDTH - LOGO_SIZE.x)/2),
            y: 20
        };
    }

    get THE_GAME_POSITION(): IPoint {
        return {
            x: Math.round((this.WIDTH - THE_GAME_SIZE.x)/2),
            y: 155
        };
    }

    get ENGLISH_BUTTON_POSITION(): IPoint {
        let x = Math.round(this.WIDTH/2) - LANGUAGE_BUTTON_SIZE.x - 5;
        let y = this.HEIGHT - LANGUAGE_BUTTON_SIZE.y - 30;
        return {
            x: x,
            y: y
        };
    }

    get SPANISH_BUTTON_POSITION(): IPoint {
        let x = Math.round(this.WIDTH/2) + 5;
        let y = this.HEIGHT - LANGUAGE_BUTTON_SIZE.y - 30;
        return {
            x: x,
            y: y
        };
    }

    getPositionForConversationLine(index: number): IPoint {
        let marginY = (index + 1) * this.LAYOUT_DEFAULT_MARGIN;
        let positionY = this.CONVERSATION_LINE_HEIGHT * index;
        return {
            x: this.LAYOUT_DEFAULT_MARGIN,
            y: this.UI_START_POSITION.y + marginY + positionY
        };
    }

    getPaginationButtonUp(): IPoint {
        let column = INV_COLUMNS;
        let row = 0;

        return this.getInventoryPositionFromRowAndColumn(row, column);
    }

    getPaginationButtonDown(): IPoint {
        let column = INV_COLUMNS;
        let row = 1;

        return this.getInventoryPositionFromRowAndColumn(row, column);
    }

    private getInventoryPositionFromRowAndColumn(row: number, column: number): IPoint {
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