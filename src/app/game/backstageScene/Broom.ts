import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { Verbs } from '../../engine/stores/Verbs.store';
import { Directions } from '../../engine/utils/Directions';
import { Skirt } from './Skirt';
import { randomText } from '../../engine/utils/RandomText';

const options = {
    id: 'broom',
    x: 103,
    y: 119,
    spriteId: 'BROOM',
    inventoryImageId: 'BROOM_INV',
    name: 'BROOM',
    goToPosition: {
        x: 117,
        y: 176
    },
    pickable: true,
    preferredAction: Verbs.TAKE,
    preferredInventoryAction: Verbs.LOOK
};

export class Broom extends Thing {

    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('I_COULD_MAKE_A_WIG_WITH_THIS');
        } else {
            player.say(randomText(
                'A_BROOM_THE_PERFECT_CLEANING_INSTRUMENT',
                'I_COULD_MAKE_A_WIG_WITH_THIS'
            ));
        }
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (selectedThing.thing.id === 'scissors') {
            this.cutWithScissors();
        } else {
            player.say('I_DONT_KNOW_HOW_TO_DO_THAT');
        }
    }

    cutWithScissors() {
        new Skirt();
        this.destroy();
    }
}
