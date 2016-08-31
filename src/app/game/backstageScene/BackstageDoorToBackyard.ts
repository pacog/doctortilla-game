import { Door } from '../../engine/models/Door';

export class BackstageDoorToBackyard extends Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'door to backyard',
            x: 739,
            y: 111,
            spriteId: 'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE',
            goToPosition: {
                x: 743,
                y: 210
            },
            destinationSceneId: 'BACKYARD',
            relatedDoorId: 'BACKYARD_TO_BACKSTAGE'
        };
        super(options);
    }

    get name() {
        if (this.getAttr('OPEN')) {
            return 'street';
        } else {
            return 'door to street';
        }
    }
}