'use strict';

var BootScene = {
    preload: function () {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    },

    create: function () {
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

        this.game.scale.setUserScale(4, 4);
        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.state.start('preloader');
    }
};

module.exports = BootScene;