import { Thing } from '../../engine/models/Thing';

let options = {
    id: 'star',
    x: 1,
    y: 1,
    spriteId: 'STAR',
    name: 'STAR',
    justDecoration: true
};

interface IStarOptions {
    x: number,
    y: number,
    id: string,
    opacity: number
}

export class Star extends Thing {
    constructor(extraOptions: IStarOptions) {
        let correctOptions = Object.assign({}, options, extraOptions);
        super(correctOptions);
    }
}
