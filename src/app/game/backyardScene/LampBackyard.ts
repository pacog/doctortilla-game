import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'lamp_door',
    x: 26,
    y: 75,
    spriteId: 'LAMP_BACKYARD',
    name: 'LAMP_BACKYARD',
    justDecoration: true,
    isForeground: true
};

export class LampBackyard extends Thing {
    constructor() {
        super(options);
    }
}
