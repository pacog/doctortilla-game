import { assetsManager } from './game/AssetsManager';

export const PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        assetsManager.loadAssets(<Phaser.Game> this.game);
    },

    create: function () {
        this.game.state.start('play');
    }
};