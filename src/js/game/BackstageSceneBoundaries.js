var SceneBoundaries = require('../engine/SceneBoundaries.js');

class BackstageSceneBoundaries extends SceneBoundaries {
    constructor() {
        super({
            MIN_Y: 310 / 2,
            MAX_Y: 450 / 2,
            MIN_X: 180 / 2,
            MAX_X: 1200 / 2
        });
    }
}

module.exports = BackstageSceneBoundaries;