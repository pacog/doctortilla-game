import { DoctortillaGame } from './game/DoctortillaGame';

class PlayScene {

    gameModel: DoctortillaGame;

    create() {
        this.gameModel = new DoctortillaGame();
    }

    update() {
        this.gameModel.update();
    }
}

export const playScene = new PlayScene();
