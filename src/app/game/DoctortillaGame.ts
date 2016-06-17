import { Game } from '../engine/models/Game';
import { label } from '../engine/stores/Labels.store';
import { DOCTORTILLA_LABELS } from './DoctortillaLabels';

export class DoctortillaGame extends Game {
    constructor() {
        let options = {
            labels: DOCTORTILLA_LABELS
        };
        super(options);
        console.log(label('Go to'));
    }
}
