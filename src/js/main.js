'use strict';

var PlayScene = require('./play-scene.js');
var PreloaderScene = require('./preloader-scene.js');
var BootScene = require('./boot-scene.js');
var layout = require('./engine/LayoutManager.singleton.js');

window.onload = function () {
    var game = new Phaser.Game(layout.WIDTH, layout.HEIGHT, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};
