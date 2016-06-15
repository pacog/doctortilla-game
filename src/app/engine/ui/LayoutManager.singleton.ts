class LayoutManager {

    LAYOUT_WIDTH: number = 1066;
    LAYOUT_HEIGHT: number = 600;
    LAYOUT_ZOOM: number = 2;

    get WIDTH():number {
        return this.LAYOUT_WIDTH / this.LAYOUT_ZOOM;
    }

    get HEIGHT():number {
        return this.LAYOUT_HEIGHT / this.LAYOUT_ZOOM;
    }
}

export const layout = new LayoutManager();