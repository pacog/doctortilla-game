import { Door } from '../../engine/models/Door';

export class BackyardDoorToBackstage extends Door {
    constructor() {
        let options = {
            id: 'BACKYARD_TO_BACKSTAGE',
            name: 'door to backstage',
            x: 150,
            y: 95,
            spriteId: 'DOOR_SPRITE',
            goToPosition: {
                x: 175,
                y: 165
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