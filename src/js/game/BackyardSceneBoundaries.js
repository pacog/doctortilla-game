var SceneBoundaries = require('../engine/models/SceneBoundaries.js');

class BackyardSceneBoundaries extends SceneBoundaries {
    constructor() {
        super({
            MIN_Y: 310 / 2,
            MAX_Y: 450 / 2,
            MIN_X: 180 / 2,
            MAX_X: 700 / 2
        });
    }
}

module.exports = BackyardSceneBoundaries;