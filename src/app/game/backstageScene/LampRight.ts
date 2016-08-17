import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'lamp_right',
    x: 450,
    y: 29,
    spriteId: 'LAMP',
    name: 'lamp right',
    justDecoration: true,
    isForeground: true
};

export class LampRight extends Thing {
    constructor() {
        super(options);
    }
}
