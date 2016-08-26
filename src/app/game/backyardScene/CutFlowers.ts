import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'cut_flowers',
    x: 127,
    y: 148,
    spriteId: 'CUT_FLOWERS',
    name: 'CUT_FLOWERS',
    justDecoration: true
};

export class CutFlowers extends Thing {
    constructor() {
        super(options);
    }
}
