import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'fly_case',
    x: 62,
    y: 198,
    spriteId: 'FLY_CASE',
    name: 'fly case',
    justDecoration: true,
    isForeground: true
};

export class FlyCase extends Thing {
    constructor() {
        super(options);
    }
}
