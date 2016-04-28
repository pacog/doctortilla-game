class SceneBoundaries {
    constructor() {
        this.MIN_Y = 429;
        this.MAX_Y = 1000;
        this.MIN_X = 173;
        this.MAX_X = 1000;
    }

    getPositionInside(x, y) {
        x = Math.max(this.MIN_X, x);
        x = Math.min(this.MAX_X, x);
        y = Math.max(this.MIN_Y, y);
        y = Math.min(this.MAX_Y, y);

        return {
            x: x,
            y: y
        };

    }
}

module.exports = SceneBoundaries;
