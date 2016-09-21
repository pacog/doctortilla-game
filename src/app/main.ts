import { phaser } from './Phaser';
import { layout } from './engine/ui/LayoutManager.singleton';
import { BootScene } from './BootScene';
import { PreloaderScene } from './PreloaderScene';
import { StartMenuScene } from './StartMenuScene';
import { CreditsScene } from './CreditsScene';
import { playScene } from './PlayScene';
import { phaserGame } from './engine/state/PhaserGame.singleton';

window.onload = function() {
    if(!isMobile()) {
        let game = new phaser.Game(layout.WIDTH, layout.HEIGHT, phaser.AUTO, 'game');

        phaserGame.value = game;

        game.state.add('boot', BootScene);
        game.state.add('preloader', PreloaderScene);
        game.state.add('startMenu', StartMenuScene);
        game.state.add('play', playScene);
        game.state.add('credits', CreditsScene);

        game.state.start('boot');
    }
};

function isMobile() {
    const MIN_WIDTH = 400;
    const MIN_HEIGHT = 400;
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    return (w < MIN_HEIGHT) || (h < MIN_HEIGHT);
}
