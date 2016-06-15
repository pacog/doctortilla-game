const LAYOUT_WIDTH = 1066;
const LAYOUT_HEIGHT = 600;
const LAYOUT_ZOOM = 2;

const LAYOUT_DEFAULT_MARGIN = 1;

const VERB_BUTTON_HEIGHT = 36;
const VERB_BUTTON_WIDTH = 150;
const VERB_BUTTON_MARGIN = LAYOUT_DEFAULT_MARGIN;
const VERBS_ROWS = 3;
const VERB_COLUMNS = 3;

const REFLECT_BUTTON_WIDTH = VERB_BUTTON_WIDTH;

const CURRENT_ACTION_INFO_HEIGHT = 40;
const CURRENT_ACTION_INFO_PADDING_X = 5;
const CURRENT_ACTION_INFO_PADDING_Y = 7;

const INV_ROWS = 2;
const INV_COLUMNS = 3;
const INV_ITEM_WIDTH = 136;
const INV_ITEM_HEIGHT = 52;

const CONVERSATION_LINE_HEIGHT = CURRENT_ACTION_INFO_HEIGHT;
const CONVERSATION_LINE_PADDING_X = 5;
const CONVERSATION_LINE_PADDING_Y = 6;


const Z_CONST = Object.freeze({
    BACKGROUND: 1,
    BACKGROUND_OBJECT: 5,
    PLAYER: 9999,
    FOREGROUND_OBJECT: 10000,
    UI: 20000,
    INVENTORY: 20001,
    INVENTORY_OBJECT: 20010,
    VERBS: 20002,
    VERBS_BUTTONS: 20002,
    VERBS_BUTTONS_TEXT: 20003,
    CURRENT_ACTION: 20004,
    CONVERSATION: 30000,
    BLOCKER: 9999999
});


class LayoutManager {

    get z() {
        return Z_CONST;
    }

    getZForBGObject() {
        this.lastZBGObject = this.lastZBGObject || Z_CONST.BACKGROUND_OBJECT;
        this.lastZBGObject += 1;
        return this.lastZBGObject;
    }

    getZForFGObject() {
        this.lastZFGObject = this.lastZFGObject || Z_CONST.FOREGROUND_OBJECT;
        this.lastZFGObject += 1;
        return this.lastZFGObject;
    }

    getZForInvObject() {
        this.lastZInvObject = this.lastZInvObject || Z_CONST.INVENTORY_OBJECT;
        this.lastZInvObject += 1;
        return this.lastZInvObject;
    }

    get HEIGHT() {
        return LAYOUT_HEIGHT / LAYOUT_ZOOM;
    }

    get WIDTH() {
        return LAYOUT_WIDTH / LAYOUT_ZOOM;
    }

    get VERB_BUTTON_HEIGHT() {
        return VERB_BUTTON_HEIGHT / LAYOUT_ZOOM;
    }

    get VERB_BUTTON_WIDTH() {
        return VERB_BUTTON_WIDTH / LAYOUT_ZOOM;
    }

    get INV_ITEM_WIDTH() {
        return INV_ITEM_WIDTH / LAYOUT_ZOOM;
    }

    get INV_ITEM_HEIGHT() {
        return INV_ITEM_HEIGHT / LAYOUT_ZOOM;
    }

    get VERBS_HEIGHT() {
        let marginY = (VERBS_ROWS + 1) * VERB_BUTTON_MARGIN;
        let heightY = VERBS_ROWS * this.VERB_BUTTON_HEIGHT;
        return marginY + heightY;
    }

    get REFLECT_BUTTON_WIDTH() {
        return REFLECT_BUTTON_WIDTH / LAYOUT_ZOOM;
    }

    get VERBS_Y_START() {
        return this.HEIGHT - this.VERBS_HEIGHT;
    }

    get UI_SIZE() {
        return {
            width: this.WIDTH,
            height: this.VERBS_HEIGHT + this.CURRENT_ACTION_INFO_HEIGHT
        };
    }

    get CURRENT_ACTION_INFO_HEIGHT() {
        return CURRENT_ACTION_INFO_HEIGHT / LAYOUT_ZOOM;
    }

    get CONVERSATION_LINE_HEIGHT() {
        return CONVERSATION_LINE_HEIGHT / LAYOUT_ZOOM;
    }

    get CONVERSATION_LINE_PADDING_X() {
        return CONVERSATION_LINE_PADDING_X;
    }

    get CONVERSATION_LINE_PADDING_Y() {
        return CONVERSATION_LINE_PADDING_Y;
    }

    get UI_START_POSITION() {
        return {
            x: 0,
            y: this.VERBS_Y_START - this.CURRENT_ACTION_INFO_HEIGHT
        };
    }

    get INVENTORY_START_POSITION() {
        return this.getVerbButtonPosition({
            x: VERB_COLUMNS,
            y: 0
        });
    }

    get CURRENT_ACTION_POSITION() {
        return {
            x: CURRENT_ACTION_INFO_PADDING_X,
            y: this.HEIGHT - this.VERBS_HEIGHT - this.CURRENT_ACTION_INFO_HEIGHT + CURRENT_ACTION_INFO_PADDING_Y
        };
    }

    getVerbButtonPosition(position) {

        let marginX = (position.x + 2) * VERB_BUTTON_MARGIN;
        let positionX = this.REFLECT_BUTTON_WIDTH + (position.x * this.VERB_BUTTON_WIDTH);

        let marginY = (position.y + 1) * VERB_BUTTON_MARGIN;
        let positionY = position.y * this.VERB_BUTTON_HEIGHT;

        return {
            x: marginX + positionX,
            y: this.VERBS_Y_START + marginY + positionY
        };
    }

    getPositionForUIInventoryItem(index) {
        let {column, row} = this._getInventoryItemPosition(index);

        let initialPosition = this.INVENTORY_START_POSITION;

        let marginX = (column + 1) * VERB_BUTTON_MARGIN;
        let positionX = column * this.INV_ITEM_WIDTH;

        let marginY = (row + 1) * VERB_BUTTON_MARGIN;
        let positionY = row * this.INV_ITEM_HEIGHT;

        return {
            x: marginX + positionX + initialPosition.x,
            y: marginY + positionY + initialPosition.y
        };
    }

    _getInventoryItemPosition(index) {
        let column = index % INV_COLUMNS;
        let row = Math.floor(index / INV_COLUMNS);
        return {
            column: column,
            row: row
        };
    }

    getReflectButtonPosition() {
        return {
            x: LAYOUT_DEFAULT_MARGIN,
            y: this.VERBS_Y_START + LAYOUT_DEFAULT_MARGIN
        };
    }

    getReflectButtonSize() {
        return {
            height: this.VERBS_HEIGHT,
            width: this.REFLECT_BUTTON_WIDTH
        };
    }

    getPositionForConversationLine(index) {
        let marginY = (index + 1) * LAYOUT_DEFAULT_MARGIN;
        let positionY = this.CONVERSATION_LINE_HEIGHT * index;
        return {
            x: LAYOUT_DEFAULT_MARGIN,
            y: this.UI_START_POSITION.y + marginY + positionY
        };
        
    }
}

let layoutManagerInstance = new LayoutManager();
module.exports = layoutManagerInstance;