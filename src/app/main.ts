/// <reference path="../vendor/phaser/phaser.d.ts"/>
import { layout } from './engine/ui/LayoutManager.singleton';
import { BootScene } from './BootScene';
import { PreloaderScene } from './PreloaderScene';
import { PlayScene } from './PlayScene';

window.onload = function() {
    let game = new Phaser.Game(layout.WIDTH, layout.HEIGHT, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};
