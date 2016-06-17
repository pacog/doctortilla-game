import { Game } from '../engine/models/Game';
import { label } from '../engine/stores/Labels.store';

export class DoctortillaGame extends Game {
    constructor() {
        let options = {};
        super(options);
        console.log(label('Go to'));
    }
}
