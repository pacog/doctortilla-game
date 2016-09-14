import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { activeInventory } from '../../engine/state/ActiveInventory.singleton';
import { Can } from './Can';

const NORMAL_FRAME = 0;
const POWDER_FRAME = 1;
const FILLED_FRAME = 2;
const POWDER_FILLED_FRAME = 3;

const options = {
    id: 'glass',
    x: 641,
    y: 128,
    spriteId: 'GLASS',
    inventoryImageId: 'GLASS_INV_SPRITE',
    name: 'GLASS',
    goToPosition: {
        x: 639,
        y: 189
    },
    pickable: true
};

export class Glass extends Thing {
    constructor() {
        super(options);
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (!this.isInInventory()) {
            player.say('I_HAVE_TO_PICK_IT_UP_FIRST');
            return;
        }
        if (selectedThing.thing.id === 'dust') {
            let dust = selectedThing.thing;
            this.fillWithDust(player, dust);
        } else if (selectedThing.thing.id === 'can') {
            let can = <Can> selectedThing.thing;
            this.fillWithDrink(player, can);
        } else {
            super.useAction(player);
        }
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('REALLY_USEFUL_TO_PUT_LIQUIDS_INSIDE');
        } else {
            player.say('IT_IS_INDEED_A_GLASS');
        }
    }

    fillWithDust(player: DoctortillaPlayer, dust: Thing): void {
        this.changeAttr('POWDER_INSIDE', true);
        dust.destroy();
    }

    protected fillWithDrink(player: DoctortillaPlayer, can: Can) {
        if (!this.getAttr('FILLED')) {
            this.changeAttr('FILLED', true);
            activeInventory.refresh();
        } else {
            player.say('IT_IS_ALREADY_FULL');
        }
    }

    isFunny(): Boolean {
        return this.getAttr('FILLED') && this.getAttr('POWDER_INSIDE');
    }

    getFrameForInventory(): number {
        if (this.getAttr('FILLED')) {
            if (this.getAttr('POWDER_INSIDE')) {
                return POWDER_FILLED_FRAME;
            } else {
                return FILLED_FRAME;
            }
        } else if (this.getAttr('POWDER_INSIDE')) {
            return POWDER_FRAME;
        }

        return NORMAL_FRAME;
    }

}
