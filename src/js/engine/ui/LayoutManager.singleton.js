const LAYOUT_WIDTH = 1066;
const LAYOUT_HEIGHT = 600;
const LAYOUT_ZOOM = 2;

const LAYOUT_DEFAULT_MARGIN = 1;

const VERB_BUTTON_HEIGHT = 36;
const VERB_BUTTON_WIDTH = 150;
const VERB_BUTTON_MARGIN = LAYOUT_DEFAULT_MARGIN;
const VERBS_ROWS = 3;

const REFLECT_BUTTON_WIDTH = VERB_BUTTON_WIDTH;

const CURRENT_ACTION_INFO_HEIGHT = 40;
const CURRENT_ACTION_INFO_PADDING_X = 5;
const CURRENT_ACTION_INFO_PADDING_Y = 7;

class LayoutManager {

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

    get UI_START_POSITION() {
        return {
            x: 0,
            y: this.VERBS_Y_START - this.CURRENT_ACTION_INFO_HEIGHT
        };
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
}

let layoutManagerInstance = new LayoutManager();
module.exports = layoutManagerInstance;