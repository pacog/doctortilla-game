import { Scene } from '../../engine/models/Scene';
import { Polygon } from '../../engine/utils/Polygon';
import { StageDoorToBackstage } from './StageDoorToBackstage';
import { StageOutsideDoor } from './StageOutsideDoor';

import { CreepyStains } from './CreepyStains';
import { Tap } from './Tap';
import { Fridge } from './Fridge';
import { Flashlight } from './Flashlight';

const sceneOptions = {
    id: 'KITCHEN',
    backgroundId: 'KITCHEN_BG',
    boundariesConfig: new Polygon([
        {x: 5, y: 221},
        {x: 87, y: 195},
        {x: 185, y: 195},
        {x: 185, y: 197},
        {x: 544, y: 197},
        {x: 554, y: 193},
        {x: 600, y: 221}
    ]),
    things: [
        new StageDoorToBackstage(),
        new StageOutsideDoor(),
        new CreepyStains(),
        new Tap(),
        new Fridge(),
        new Flashlight()
    ]
};

export class KitchenScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}