'use strict';

var Game = require('./engine/model/game.js');

var PlayScene = {
    create: function () {
        this.gameModel = new Game(this.game);
    }
};

module.exports = PlayScene;
