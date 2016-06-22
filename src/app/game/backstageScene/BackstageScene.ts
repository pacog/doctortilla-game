import { Scene } from '../../engine/models/Scene';

const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG'
};

export class BackstageScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}