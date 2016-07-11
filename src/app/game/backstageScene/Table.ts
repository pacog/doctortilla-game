import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'table',
    x: 93,
    y: 130,
    spriteId: 'TABLE',
    name: 'table',
    justDecoration: true
};

export class Table extends Thing {
    constructor() {
        super(options);
    }
}
