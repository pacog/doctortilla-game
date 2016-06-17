import { phaser } from './Phaser';
import { layout } from './engine/ui/LayoutManager.singleton';
import { BootScene } from './BootScene';
import { PreloaderScene } from './PreloaderScene';
import { playScene } from './PlayScene';
import { phaserGame } from './engine/state/PhaserGame.singleton';

window.onload = function() {
    let game = new phaser.Game(layout.WIDTH, layout.HEIGHT, phaser.AUTO, 'game');

    phaserGame.value = game;

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', playScene);

    game.state.start('boot');
};
