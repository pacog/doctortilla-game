'use strict';

var Game = require('./engine/Game.js');

var PlayScene = {
    create: function () {
        this.gameModel = new Game(this.game);
    }
};

module.exports = PlayScene;
