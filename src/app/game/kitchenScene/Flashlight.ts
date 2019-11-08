import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'flashlight',
    x: 188,
    y: 149,
    spriteId: 'FLASHLIGHT',
    inventoryImageId: 'FLASHLIGHT_INV',
    name: 'FLASHLIGHT',
    goToPosition: {
        x: 202,
        y: 206
    },
    directionToLook: Directions.UP,
    pickable: true

};

export class Flashlight extends Thing {
    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) { 
        player.say('USEFUL_FLASHLIGHT'); 
    }
}
