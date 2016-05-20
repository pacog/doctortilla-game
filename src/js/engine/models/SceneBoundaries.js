class SceneBoundaries {
    constructor(options) {
        this.options = options;
    }

    getPositionInside(x, y) {
        x = Math.max(this.options.MIN_X, x);
        x = Math.min(this.options.MAX_X, x);
        y = Math.max(this.options.MIN_Y, y);
        y = Math.min(this.options.MAX_Y, y);

        return {
            x: Math.round(x),
            y: Math.round(y)
        };

    }
}

module.exports = SceneBoundaries;
