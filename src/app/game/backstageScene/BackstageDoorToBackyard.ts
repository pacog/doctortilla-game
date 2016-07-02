import { Door } from '../../engine/models/Door';

export class BackstageDoorToBackyard extends Door {
    constructor() {
        let options = {
            id: 'BACKSTAGE_TO_BACKYARD',
            name: 'door to backyard',
            x: 150,
            y: 95,
            spriteId: 'DOOR_SPRITE',
            goToPosition: {
                x: 175,
                y: 165
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