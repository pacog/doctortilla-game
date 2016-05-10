'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('scene1_BG', 'images/fondo2.png');
        this.game.load.bitmapFont('font_1', 'images/font.png', 'images/font.fnt');

        this.game.load.spritesheet('buttons_BG', 'images/buttons_bg.png', 100, 30);
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite10.png', 44, 61, 21);
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;