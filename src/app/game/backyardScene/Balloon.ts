import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from '../backstageScene/Costume';
import { Skirt } from '../backstageScene/Skirt';
import { Coconut } from '../backstageScene/Coconut';
import { Directions } from '../../engine/utils/Directions';
import { style } from '../../engine/ui/Style';

let spriteOptions = new Map();

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

export class Balloon extends Thing {

    constructor() {
        super(options);
    }

    show(): void {
        super.show();
        this.playAnimation('floating');
    }

}
