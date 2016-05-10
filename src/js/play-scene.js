'use strict';

var DoctortillaGame = require('./game/DoctortillaGame.js');

var PlayScene = {
    create: function () {
        this.gameModel = new DoctortillaGame(this.game);
    }
};

module.exports = PlayScene;
