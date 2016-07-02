import { Scene } from '../../engine/models/Scene';
import { BackyardDoorToBackstage } from './BackyardDoorToBackstage';

const sceneOptions = {
    id: 'BACKYARD',
    backgroundId: 'BACKYARD_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    },
    things: [
        new BackyardDoorToBackstage()
    ]
};

export class BackyardScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}