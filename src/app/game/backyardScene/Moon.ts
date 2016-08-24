import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'moon',
    x: 381,
    y: 22,
    spriteId: 'MOON',
    name: 'MOON',
    justDecoration: true,
    isForeground: true
};

export class Moon extends Thing {
    constructor() {
        super(options);
    }
}
