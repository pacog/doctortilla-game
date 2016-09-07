import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { selectedThing } from '../../engine/state/SelectedObjects';

const FULL_FRAME = 3;
const FLOWER_AND_COCONUT_FRAME = 1;
const FLOWER_AND_SKIRT_FRAME = 2;
const SKIRT_AND_COCONUT_FRAME = 0;

const options = {
    id: 'costume',
    x: 137,
    y: 130,
    spriteId: 'COSTUME_SPRITE',
    inventoryImageId: 'COSTUME_SPRITE',
    name: 'costume',
    directlyInInventory: true
};

export class Costume extends Thing {
    constructor() {
        super(options);
    }

    protected useAction(player: DoctortillaPlayer): void {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        if (selectedThing.thing.id === 'coconut') {
            this.addCoconut(player);
            selectedThing.thing.destroy();
        } else if (selectedThing.thing.id === 'flowers') {
            this.addFlowers(player);
            selectedThing.thing.destroy();
        } else if (selectedThing.thing.id === 'skirt') {
            this.addSkirt(player);
            selectedThing.thing.destroy();
        } else {
            player.say('I don\t know how to do that...');
        }
    }

    protected lookAction(player: DoctortillaPlayer): void {
        //TODO: check different states
        player.say('Almost done!');
    }

    getFrameForInventory(): number {
        if (this.isComplete()) {
            return FULL_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_COCONUT') && this.getAttr('HAS_SKIRT')) {
            return SKIRT_AND_COCONUT_FRAME;
        }
        if (this.getAttr('HAS_SKIRT') && this.getAttr('HAS_FLOWERS')) {
            return FLOWER_AND_SKIRT_FRAME;
        }
        return FULL_FRAME;
    }

    addCoconut(player: DoctortillaPlayer): void {
        this.changeAttr('HAS_COCONUT', true);
        this.informPlayerIfComplete(player);
    }

    addFlowers(player: DoctortillaPlayer): void {
        this.changeAttr('HAS_FLOWERS', true);
        this.informPlayerIfComplete(player);
    }

    addSkirt(player: DoctortillaPlayer) {
        this.changeAttr('HAS_SKIRT', true);
        this.informPlayerIfComplete(player);
    }

    private isComplete(): Boolean {
        return this.getAttr('HAS_COCONUT') && this.getAttr('HAS_FLOWERS') && this.getAttr('HAS_SKIRT');
    }

    private informPlayerIfComplete(player: DoctortillaPlayer): void {
        if(this.isComplete()) {
            player.changeAttr('COSTUME_COMPLETE', true);
        }
    }

}
