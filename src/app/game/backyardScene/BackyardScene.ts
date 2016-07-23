import { Scene } from '../../engine/models/Scene';
import { BackyardDoorToBackstage } from './BackyardDoorToBackstage';
import { Flowers } from './Flowers';
import { Bili } from './Bili';
import { Polygon } from '../../engine/utils/Polygon';

const sceneOptions = {
    id: 'BACKYARD',
    backgroundId: 'BACKYARD_BG',
    boundariesConfig: new Polygon([
        {x: 10, y: 20},
        {x: 100, y: 200},
        {x: 200, y: 300}
    ]),
    things: [
        new BackyardDoorToBackstage(),
        new Flowers(),
        new Bili()
    ]
};

export class BackyardScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}