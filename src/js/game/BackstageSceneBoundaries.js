var SceneBoundaries = require('../engine/SceneBoundaries.js');

class BackstageSceneBoundaries extends SceneBoundaries {
    constructor() {
        super({
            MIN_Y: 113 * 2,
            MAX_Y: 149 * 2,
            MIN_X: 43 * 2,
            MAX_X: 500 * 2
        });
    }
}

module.exports = BackstageSceneBoundaries;