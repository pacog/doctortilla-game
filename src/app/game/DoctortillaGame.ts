import { Game } from '../engine/models/Game';
import { DOCTORTILLA_LABELS } from './DoctortillaLabels';
import { DoctortillaPlayer } from './DoctortillaPlayer';
import { BackstageScene } from './backstageScene/BackstageScene';
import { BackyardScene } from './backyardScene/BackyardScene';

export class DoctortillaGame extends Game {
    constructor() {
        let options = {
            labels: DOCTORTILLA_LABELS,
            player: new DoctortillaPlayer(),
            scenes: [
                new BackstageScene(),
                new BackyardScene()
            ],
            initialSceneId: 'BACKSTAGE'
        };
        super(options);
    }
}
