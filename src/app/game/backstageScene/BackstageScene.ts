import { Scene } from '../../engine/models/Scene';
import { Broom } from './Broom';
import { BackstageDoorToBackyard } from './BackstageDoorToBackyard';

const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    },
    things: [
        new Broom(),
        new BackstageDoorToBackyard()
    ]
};

export class BackstageScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}