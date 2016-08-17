import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { scenes } from '../../engine/state/Scenes.singleton';

const options = {
    id: 'cable',
    x: 187,
    y: 125,
    spriteId: 'CABLE',
    inventoryImageId: 'CABLE',
    name: 'cable',
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
                player.say('Finally, I have the $%# cable!');
                this.letPlayerComeAndTakeIt(player);
            } else {
                player.say('It is stuck behind the vending machine, I need to move it somehow.');
            }
        });
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('Cool, now I should give that to the guys');
        } else {
            player.say('This is the cable I need!');
        }
    }

}
