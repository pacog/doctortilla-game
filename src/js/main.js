'use strict';

var PlayScene = require('./play-scene.js');
var PreloaderScene = require('./preloader-scene.js');
var BootScene = require('./boot-scene.js');

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
            null, false, false);

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};
