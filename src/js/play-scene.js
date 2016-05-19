'use strict';

var DoctortillaGame = require('./game/DoctortillaGame.js');

var PlayScene = {
    create: function () {
        this.gameModel = new DoctortillaGame(this.game);
    },

    update: function () {
        this.gameModel.update();
    }
};

module.exports = PlayScene;
