import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { activeInventory } from '../../engine/state/ActiveInventory.singleton';
import { Dust } from './Dust';
import { Can } from './Can';

const NORMAL_FRAME = 0;
const POWDER_FRAME = 1;
const FILLED_FRAME = 2;
const POWDER_FILLED_FRAME = 3;

const options = {
    id: 'glass',
    x: 137,
    y: 130,
    spriteId: 'GLASS_SPRITE',
    inventoryImageId: 'GLASS_SPRITE',
    name: 'glass',
    goToPosition: {
        x: 167,
        y: 180
    },
    pickable: true
};

export class Glass extends Thing {
    constructor() {
        super(options);
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'dust') {
            let dust = <Dust> selectedThing.thing;
            this.fillWithDust(player, dust);
        } else if (selectedThing.thing.id === 'can') {
            let can = <Can> selectedThing.thing;
            this.fillWithDrink(player, can);
        } else {
            player.say('I don\t know how to do that...');
        }
    }

    protected lookAction(player: DoctortillaPlayer): void {
        if (this.isInInventory()) {
            player.say('Really useful to put liquids or other substances inside');
        } else {
            player.say('It is indeed a glass');
        }
    }

    protected fillWithDust(player: DoctortillaPlayer, dust: Dust): void {
        this.changeAttr('POWDER_INSIDE', true);
        dust.destroy();
    }

    protected fillWithDrink(player: DoctortillaPlayer, can: Can) {
        if (!this.getAttr('FILLED')) {
            this.changeAttr('FILLED', true);
            activeInventory.refresh();
        } else {
            player.say('It is already full');
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
