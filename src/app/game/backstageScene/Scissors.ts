import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Broom } from './Broom';
import { randomText } from '../../engine/utils/RandomText';

const options = {
    id: 'scissors',
    x: 291,
    y: 128,
    spriteId: 'SCISSORS',
    inventoryImageId: 'SCISSORS_INV',
    name: 'SCISSORS',
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
            player.say('SHINY_AND_SHARP');
        } else {
            player.say(randomText(
                'SHINY_AND_SHARP',
                'NOT_SAFE_HAVING_SCISSORS_AROUND_MUSICIANS'
            ));
        }
    }

    protected useAction(player: DoctortillaPlayer) {
        let otherObject = selectedThing.thing;
        if (otherObject.id === 'broom') {
            let broom = <Broom> otherObject;
            broom.cutWithScissors();
        } else {
            super.useAction(player);
        }
    }

}
