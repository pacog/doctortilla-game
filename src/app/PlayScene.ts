import { DoctortillaGame } from './game/DoctortillaGame';
import { phaserGame } from './engine/state/PhaserGame.singleton';

class PlayScene {

    gameModel: DoctortillaGame;

    create() {
        this.gameModel = new DoctortillaGame();
    }

    update() {
        this.gameModel.update();
    }

    render() {
        // phaserGame.value.debug.inputInfo(32, 32);
        // phaserGame.value.debug.pointer( phaserGame.value.input.activePointer );
    }
}

export const playScene = new PlayScene();
