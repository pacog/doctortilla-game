import { layout } from './engine/ui/LayoutManager.singleton';
import { phaser } from './Phaser';

export const BootScene = {
    preload: function() {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/ui/PRELOADER_BAR.png');
    },

    create: function () {
        this.game.scale.scaleMode = phaser.ScaleManager.USER_SCALE;

        this.game.scale.setUserScale(layout.LAYOUT_ZOOM, layout.LAYOUT_ZOOM);
        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.state.start('preloader');
    }
};