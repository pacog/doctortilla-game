import { Thing } from '../../engine/models/Thing';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { scenes } from '../../engine/state/Scenes.singleton';
import { Bili } from './Bili';
import { uiBlocker } from '../../engine/ui/UIBlocker.singleton';
import { phaserGame } from '../../engine/state/PhaserGame.singleton';
import { analytics } from '../../engine/utils/analytics';

let spriteOptions = new Map();

spriteOptions.set('quiet', { frames: [0]});
spriteOptions.set('floating', { frames: [0, 1, 2, 3, 4, 5]});
spriteOptions.set('explode', { frames: [6, 7, 8, 9]});
const EXPLODED_FRAME = 9;

const options = {
    id: 'balloon',
    x: 252,
    y: 96,
    spriteId: 'BALLOON_SPRITE',
    name: 'BALLOON',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions.RIGHT,
    spriteOptions: spriteOptions,
    animationSpeed: style.DEFAULT_ANIMATION_SPEED
};

const MIN_TIME_FOR_ANIMATION = 300;
const MAX_TIME_FOR_ANIMATION = 5000;

export class Balloon extends Thing {

    private lastTimeout: number;

    constructor() {
        super(options);
    }

    show(): void {
        super.show();
        this.playAnimationSometime();
    }

    destroy(): void {
        this.stopEverything();
        super.destroy();
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (selectedThing.thing.id === 'scissors') {
            let bili = <Bili> scenes.getSceneById('BACKYARD').getThingById('bili');
            if(bili.getAttr('DRUNK')) {
                this.explodeBalloon(player, bili);
            } else {
                player.say('HE_IS_BEING_GOOD_FOR_NOW_NO_NEED_TO_EXPLODE_IT');
            }
        } else {
            super.useAction(player);
        }
    }

    protected lookAction(player: DoctortillaPlayer): void {
        player.say('THAT_IS_A_HUGE_BALLOON_QUITE_SCARY_IF_IT_EXPLODES');
    }

    protected takeAction(player: DoctortillaPlayer): void  {
        player.say('NOPE_I_DONT_WANT_TO_TAKE_BILIS_BALLOON');
    }

    private playAnimationSometime(): void {
        if (!this.getAttr('EXPLODED')) {
            this.playAnimation('quiet');
            this.lastTimeout = setTimeout(() => {
                this.playAnimationOnce('floating').then(() => {
                    this.playAnimationSometime();
                });
            }, this.getTimeForNextAnimation());
        }
    }

    private getTimeForNextAnimation(): number {
        return MIN_TIME_FOR_ANIMATION + Math.random()*(MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }

    private explodeBalloon(player: DoctortillaPlayer, bili: Bili): void {
        analytics.sendEvent('game', 'explode_balloon');
        analytics.sendEvent('game', 'end_game');
        uiBlocker.block();
        player.goToThing(this)
            .then(() => {
                return player.playAnimationOnce('pierce_balloon');
            })
            .then(() => {
                this.changeAttr('EXPLODED', true);
                this.stopEverything();
                return this.playAnimationOnce('explode');
            })
            .then(() => {
                this.explode();
                return bili.say('I_AM_AWAKE');
            })
            .then(() => {
                return bili.say('I_AM_NOT_DRUNK_ANYMORE');
            })
            .then(() => {
                return bili.say('WE_CAN_PLAY_THE_CONCERT_NOW');
            })
            .then(() => {
                return player.moveTo({ x: 181, y: 212});
            })
            .then(() => {
                player.lookAt(Directions.DOWN);
                return player.say('SO_THIS_IS_THE_END_FOLKS');
            })
            .then(() => {
                return player.say('WE_LAUGHED');
            })
            .then(() => {
                return player.say('WE_CRIED');
            })
            .then(() => {
                return player.say('AND_WE_LEARNED');
            })
            .then(() => {
                return player.wait(1000);
            })
            .then(() => {
                return player.say('THANKS_FOR_HELPING_ME_IN_THIS_ADVENTURE');
            })
            .then(() => {
                return player.say('SEE_YOU_SOON');
            })
            .then(() => {
                analytics.sendEvent('game', 'end_game');
                uiBlocker.unblock();
                phaserGame.value.state.start('credits');
            });
    }

    private explode(): void {
        this.sprite.frame = EXPLODED_FRAME;
        this.sprite.animations.stop();
        this.sprite.frame = EXPLODED_FRAME;
    }

    private stopEverything(): void {
       
        if(this.lastTimeout) {
            window.clearTimeout(this.lastTimeout);
        }
        if(this.sprite.animations.currentAnim) {
            this.sprite.animations.currentAnim.stop();
        }
        this.sprite.animations.stop();
    }

}
