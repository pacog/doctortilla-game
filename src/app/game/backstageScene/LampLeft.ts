import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'lamp_left',
    x: 136,
    y: 29,
    spriteId: 'LAMP',
    name: 'lamp left',
    justDecoration: true,
    isForeground: true
};

export class LampLeft extends Thing {
    constructor() {
        super(options);
    }
}
