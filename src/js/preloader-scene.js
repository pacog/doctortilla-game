'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('backstage_BG', 'images/backstage.png');
        this.game.load.image('backyard_BG', 'images/backyard.png');
        this.game.load.image('UI_BG', 'images/uibg.png');
        this.game.load.bitmapFont('font_32_orange', 'images/font_32_orange.png', 'images/font_32_orange.fnt');
        this.game.load.bitmapFont('font_32_black', 'images/font_32_black.png', 'images/font_32_black.fnt');
        this.game.load.bitmapFont('font_32_white', 'images/font_32_white.png', 'images/font_32_orange.fnt');

        this.game.load.spritesheet('buttons_BG', 'images/verb_buttons.png', 75, 18);
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite10.png', 44, 61, 21);
        this.game.load.spritesheet('vending', 'images/vending.png', 26, 50, 1);
        this.game.load.spritesheet('door_sprite', 'images/puerta_1.png', 40, 60, 2);
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;