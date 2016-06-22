import { Player } from '../engine/models/Player';

let spriteOptions = new Map();

spriteOptions.set('stand_right', { frames: [0]});
spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6]});
spriteOptions.set('stand_left', { frames: [0], inverse: true});
spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
spriteOptions.set('stand_up', { frames: [14]});
spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20]});
spriteOptions.set('stand_down', { frames: [7]});
spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13]});

const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 200,
    initialY: 200,
    xSpeed: 80, //px/s
    ySpeed: 55, //px/s
    animationSpeed: 6,
    spriteOptions: spriteOptions
};

export class DoctortillaPlayer extends Player {
    constructor() {
        super(options);
    }
}