import { Game } from '../engine/models/Game';
import { DOCTORTILLA_LABELS } from './DoctortillaLabels';
import { DoctortillaPlayer } from './DoctortillaPlayer';
import { BackstageScene } from './backstageScene/BackstageScene';

export class DoctortillaGame extends Game {
    constructor() {
        let options = {
            labels: DOCTORTILLA_LABELS,
            player: new DoctortillaPlayer(),
            scenes: [
                new BackstageScene()
            ],
            initialSceneId: 'BACKSTAGE'
        };
        super(options);
    }
}
