'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('scene1_BG', 'images/fondo2.png');
        this.game.load.image('vaca1', 'images/vaca4.png');
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite.png', 44, 61, 7);
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;