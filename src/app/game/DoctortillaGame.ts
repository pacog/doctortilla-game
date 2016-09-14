import { Game } from '../engine/models/Game';
import { DOCTORTILLA_LABELS } from './DoctortillaLabels';
import { DoctortillaPlayer } from './DoctortillaPlayer';
import { BackstageScene } from './backstageScene/BackstageScene';
import { BackyardScene } from './backyardScene/BackyardScene';
import { Directions } from '../engine/utils/Directions';
import { uiBlocker } from '../engine/ui/UIBlocker.singleton';

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

    protected onStart(): void {
        // uiBlocker.block();
        // let player = this.options.player;
        // player.moveTo({ x: 115, y: 187})
        //     .then(() => {
        //        return player.wait(1000);
        //     })
        //     .then(() => {
        //         player.lookAt(Directions.DOWN);
        //         return player.say('LATE_FOR_CONCERT');
        //     })
        //     .then(() => {
        //        return player.wait(1000);
        //     })
        //     .then(() => {
        //        return player.say('AGAIN');
        //     })
        //     .then(() => {
        //        return player.wait(1000);
        //     })
        //     .then(() => {
        //        return player.say('THE_OTHERS_WILL_BE_READY');
        //     })
        //     .then(() => {
        //        return player.moveTo({ x: 383, y: 183});
        //     })
        //     .then(() => {
        //         uiBlocker.unblock();
        //     });
    }
}
