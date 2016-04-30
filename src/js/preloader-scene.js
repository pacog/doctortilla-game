'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('scene1_BG', 'images/fondo1.png');
        this.game.load.image('vaca1', 'images/vaca1.png');
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;