import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Broom } from './Broom';

const options = {
    id: 'scissors',
    x: 291,
    y: 128,
    spriteId: 'SCISSORS',
    inventoryImageId: 'SCISSORS_INV',
    name: 'scissors',
    goToPosition: {
        x: 300,
        y: 180
    },
    pickable: true
};

export class Scissors extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) {
        if (this.isInInventory()) {
            player.say('Shiny and sharp!');
        } else {
            player.say('Not safe having scissors around musicians');
        }
    }

    protected useAction(player: DoctortillaPlayer) {
        let otherObject = selectedThing.thing;
        if (otherObject.id === 'broom') {
            let broom = <Broom> otherObject;
            broom.cutWithScissors();
        } else {
            player.say('I don\'t know how to do that');
        }
    }

}
