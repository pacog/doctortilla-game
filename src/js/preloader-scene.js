'use strict';

var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('backstage_BG', 'images/backstage.png');
        this.game.load.image('backyard_BG', 'images/backyard.png');
        this.game.load.image('UI_BG', 'images/uibg.png');
        this.game.load.image('UI_CONVERSATION_BG', 'images/UI_CONVERSATION_BG.png');
        this.game.load.image('UI_INV_BG', 'images/inv-bg.png');

        this.game.load.bitmapFont('font_32_orange', 'images/font_32_orange.png', 'images/font_32_orange.fnt');
        this.game.load.bitmapFont('font_32_black', 'images/font_32_black.png', 'images/font_32_black.fnt');
        this.game.load.bitmapFont('font_32_white', 'images/font_32_white.png', 'images/font_32_orange.fnt');
        this.game.load.spritesheet('CONVERSATION_LINE_BG', 'images/conversation-line-bg.png', 529, 20);


        this.game.load.spritesheet('buttons_BG', 'images/verb_buttons.png', 75, 18);
        //Last number is optional (number of images in sprite)
        this.game.load.spritesheet('vaca_sprite', 'images/vaca_sprite10.png', 44, 61, 21);
        this.game.load.spritesheet('VENDING_SPRITE', 'images/vending_sprite.png', 33, 57, 3);
        this.game.load.spritesheet('CABLE_SPRITE', 'images/cable.png', 18, 13, 1);
        this.game.load.image('broom', 'images/broom.png');
        this.game.load.image('broom_inv', 'images/broom_inv.png');
        this.game.load.spritesheet('door_sprite', 'images/puerta_1.png', 40, 60, 2);

        this.game.load.spritesheet('BAND_IN_SOFA_SPRITE', 'images/resto_grupo.png', 111, 79, 9);

        this.game.load.image('bocadillo', 'images/bocadillo1.png');
        this.game.load.image('panceta', 'images/panceta.png');
        this.game.load.image('pan', 'images/bread.png');
        this.game.load.image('scissors', 'images/scissors.png');
        this.game.load.image('table', 'images/mesa.png');
        this.game.load.image('dust', 'images/polvo.png');
        this.game.load.image('glass', 'images/vaso.png');
        this.game.load.image('full_glass', 'images/vaso_lleno.png');
        this.game.load.image('coconut', 'images/coco.png');
        this.game.load.image('can', 'images/lata.png');
        this.game.load.image('coin', 'images/moneda.png');

        this.game.load.image('monigote', 'images/monigote.png');
    },

    create: function () {
        this.game.state.start('play');
    }
};

module.exports = PreloaderScene;