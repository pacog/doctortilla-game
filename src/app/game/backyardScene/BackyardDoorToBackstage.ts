import { Door } from '../../engine/models/Door';

export class BackyardDoorToBackstage extends Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'door to backstage',
            x: 56,
            y: 95,
            spriteId: 'BACKYARD_DOOR_TO_BACKSTAGE',
            goToPosition: {
                x: 98,
                y: 187
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