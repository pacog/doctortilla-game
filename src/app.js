import {GamePainter} from './engine/graphics/GamePainter';
import {DoctortillaGame} from './game/DoctortillaGame';

global.app = function () {
    var doctortillaGame = new DoctortillaGame();
    var gamePainter = new GamePainter();
    gamePainter.paint();
};