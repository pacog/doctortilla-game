import { Game } from '../engine/models/Game';
import { DOCTORTILLA_LABELS } from './DoctortillaLabels';
import { DoctortillaPlayer } from './DoctortillaPlayer';

export class DoctortillaGame extends Game {
    constructor() {
        let options = {
            labels: DOCTORTILLA_LABELS,
            player: new DoctortillaPlayer()
        };
        super(options);
    }
}
