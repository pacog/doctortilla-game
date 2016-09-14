import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { scenes } from '../../engine/state/Scenes.singleton';

const options = {
    id: 'cable',
    x: 187,
    y: 125,
    spriteId: 'CABLE',
    inventoryImageId: 'CABLE_INV',
    name: 'CABLE',
    goToPosition: {
        x: 219,
        y: 165
    },
    pickable: true
};

export class Cable extends Thing {
    constructor() {
        super(options);
    }

    protected takeAction(player: DoctortillaPlayer): void {
        player.goToThing(this).then(() => {
            let vendingMachine = scenes.currentScene.getThingById('vending');
            if (!vendingMachine) {
                throw 'ERROR: vending machine should be present in current scene';
            }

            if (vendingMachine.getAttr('PUSHED')) {
                player.say('FINALLY_I_GOT_THE_CABLE');
                this.letPlayerComeAndTakeIt(player);
            } else {
                player.say('IT_IS_STUCK_BEHIND_THE_VENDING_MACHINE');
            }
        });
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('COOL_NOW_I_SHOULD_GIVE_IT_TO_THE_GUYS');
        } else {
            player.say('THIS_CABLE_COULD_BE_USEFUL');
        }
    }

}
