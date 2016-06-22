import { IPoint } from '../utils/Interfaces';

const VERB_BUTTON_HEIGHT: number = 36;
const CURRENT_ACTION_INFO_HEIGHT = 40;

class LayoutManager {

    LAYOUT_WIDTH: number = 1066;
    LAYOUT_HEIGHT: number = 600;
    LAYOUT_ZOOM: number = 2;
    VERBS_ROWS: number = 3;
    VERB_COLUMNS: number = 3;
    LAYOUT_DEFAULT_MARGIN: number = 1;
    VERB_BUTTON_MARGIN: number = this.LAYOUT_DEFAULT_MARGIN;

    get WIDTH(): number {
        return this.LAYOUT_WIDTH / this.LAYOUT_ZOOM;
    }

    get HEIGHT(): number {
        return this.LAYOUT_HEIGHT / this.LAYOUT_ZOOM;
    }

    get VERBS_HEIGHT(): number {
        let marginY = (this.VERBS_ROWS + 1) * this.VERB_BUTTON_MARGIN;
        let heightY = this.VERBS_ROWS * this.VERB_BUTTON_HEIGHT;
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
}

export const layout = new LayoutManager();