import { Thing } from '../../engine/models/Thing';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';

let spriteOptions = new Map();

spriteOptions.set('quiet', { frames: [1]});
spriteOptions.set('floating', { frames: [1, 2, 3, 4, 5, 6]});

const options = {
    id: 'balloon',
    x: 252,
    y: 96,
    spriteId: 'BALLOON_SPRITE',
    name: 'balloon',
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

    constructor() {
        super(options);
    }

    show(): void {
        super.show();
        this.playAnimationSometime();
    }

    private playAnimationSometime(): void {
        this.playAnimation('quiet');
        setTimeout(() => {
            this.playAnimationOnce('floating').then(() => {
                this.playAnimationSometime();
            });
        }, this.getTimeForNextAnimation());
    }

    private getTimeForNextAnimation(): number {
        return MIN_TIME_FOR_ANIMATION + Math.random()*(MAX_TIME_FOR_ANIMATION - MIN_TIME_FOR_ANIMATION);
    }

}
