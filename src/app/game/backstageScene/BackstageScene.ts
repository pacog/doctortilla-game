import { Scene } from '../../engine/models/Scene';

const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    }
};

export class BackstageScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}