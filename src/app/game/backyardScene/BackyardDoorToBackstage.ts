import { Door } from '../../engine/models/Door';

export class BackyardDoorToBackstage extends Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'door to backstage',
            x: 36,
            y: 115,
            spriteId: 'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE',
            goToPosition: {
                x: 78,
                y: 207
            },
            destinationSceneId: 'BACKSTAGE',
            relatedDoorId: 'BACKSTAGE_TO_BACKYARD'
        };
        super(options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'backstage';
        } else {
            return 'door to backstage';
        }
    }
}