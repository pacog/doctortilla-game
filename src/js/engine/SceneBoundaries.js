class SceneBoundaries {
    constructor() {
        this.MIN_Y = 113 * 2;
        this.MAX_Y = 149 * 2;
        this.MIN_X = 43 * 2;
        this.MAX_X = 500 * 2;
    }

    getPositionInside(x, y) {
        x = Math.max(this.MIN_X, x);
        x = Math.min(this.MAX_X, x);
        y = Math.max(this.MIN_Y, y);
        y = Math.min(this.MAX_Y, y);

        return {
            x: Math.round(x),
            y: Math.round(y)
        };

    }
}

module.exports = SceneBoundaries;
