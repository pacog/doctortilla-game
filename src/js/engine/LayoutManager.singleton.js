const LAYOUT_WIDTH = 800;
const LAYOUT_HEIGHT = 600;
const LAYOUT_ZOOM = 2;

const VERB_BUTTON_HEIGHT = 60;
const VERB_BUTTON_WIDTH = 200;
const VERB_BUTTON_MARGIN = 4;
const VERBS_COLUMNS = 1;

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

    get VERBS_Y_START() {
        let marginY = (VERBS_COLUMNS + 1) * VERB_BUTTON_MARGIN;
        let heightY = VERBS_COLUMNS * VERB_BUTTON_HEIGHT;
        
        return this.HEIGHT - heightY - marginY;
    }

    getVerbButtonPosition(position) {

        let marginX = (position.x + 1) * VERB_BUTTON_MARGIN;
        let positionX = position.x * this.VERB_BUTTON_WIDTH;

        let marginY = (position.y + 1) * VERB_BUTTON_MARGIN;
        let positionY = position.y * this.VERB_BUTTON_HEIGHT;

        return {
            x: marginX + positionX,
            y: this.VERBS_Y_START + marginY + positionY
        };
    }
}

let layoutManagerInstance = new LayoutManager();
module.exports = layoutManagerInstance;