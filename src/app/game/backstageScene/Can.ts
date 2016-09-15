import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { selectedThing } from '../../engine/state/SelectedObjects';

export class Can extends Thing {
    constructor() {
        let options = {
            id: 'can',
            inventoryImageId: 'CAN_INV',
            name: 'CAN',
            directlyInInventory: true
        };
        super(options);
    }

    protected useAction(player: Player): void {
        if (selectedThing.thing.id === 'glass') {
            let glass = <any> selectedThing.thing;
            glass.fillWithDrink(player, this);
        } else if (selectedThing.thing.id === 'dust') {
            player.say('I_SHOULD_PROBABLY_MIX_IT_IN_A_GLASS');
        } else {
            super.useAction(player);
        }
    }

}
