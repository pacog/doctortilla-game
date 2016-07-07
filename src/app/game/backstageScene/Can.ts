import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { selectedThing } from '../../engine/state/SelectedObjects';

export class Can extends Thing {
    constructor() {
        let options = {
            id: 'can',
            inventoryImageId: 'CAN_INV',
            name: 'can',
            directlyInInventory: true
        };
        super(options);
    }

    protected useAction(player: Player): void {
        if (selectedThing.thing.id === 'glass') {
            // TODO: glass class and casting
            // let glass = selectedThing.thing;
            // glass.fillWithDrink(player, this);
        } else if (selectedThing.thing.id === 'dust') {
            player.say('I should probably mix it in a glass');
        } else {
            player.say('I don\t know how to do that...');
        }
    }

}
