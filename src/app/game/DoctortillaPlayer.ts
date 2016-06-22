import { Player } from '../engine/models/Player';

const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 200,
    initialY: 200,
    xSpeed: 80, //px/s
    ySpeed: 55, //px/s
    animationSpeed: 6
};

export class DoctortillaPlayer extends Player {
    constructor() {
        super(options);
    }
}