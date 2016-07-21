import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Directions } from '../../engine/utils/Directions';
import { Skirt } from './Skirt';

const options = {
    id: 'broom',
    x: 254,
    y: 101,
    spriteId: 'BROOM',
    inventoryImageId: 'BROOM_INV',
    name: 'broom',
    goToPosition: {
        x: 250,
        y: 175
    },
    pickable: true,
    directionToLook: Directions.RIGHT
};

export class Broom extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('Awesome, now I have a broom');
        } else {
            player.say('Si yo tuviera una escoba...');
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (selectedThing.thing.id === 'scissors') {
            this.cutWithScissors();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    cutWithScissors() {
        new Skirt();
        this.destroy();
    }
}
