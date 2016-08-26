import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Costume } from '../backstageScene/Costume';
import { Skirt } from '../backstageScene/Skirt';
import { Coconut } from '../backstageScene/Coconut';
import { Directions } from '../../engine/utils/Directions';

const options = {
    id: 'balloon',
    x: 252,
    y: 96,
    spriteId: 'BALLOON',
    name: 'balloon',
    goToPosition: {
        x: 239,
        y: 185
    },
    directionToLook: Directions.RIGHT
};

export class Balloon extends Thing {

    constructor() {
        super(options);
    }

}
