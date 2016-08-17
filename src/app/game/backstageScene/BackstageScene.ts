import { Scene } from '../../engine/models/Scene';
import { Broom } from './Broom';
import { VendingMachine } from './VendingMachine';
import { BackstageDoorToBackyard } from './BackstageDoorToBackyard';
import { BandInSofa } from './BandInSofa';
import { Scissors } from './Scissors';
import { Bocadillo } from './Bocadillo';
import { Cable } from './Cable';
import { Coconut } from './Coconut';
import { Table } from './Table';
import { Dust } from './DustInTable';
import { Glass } from './Glass';
import { Polygon } from '../../engine/utils/Polygon';

const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: new Polygon([
        {x: 55, y: 218},
        {x: 114, y: 158},
        {x: 736, y: 158},
        {x: 790, y: 218}
    ]),
    things: [
        // new Broom(),
        new BackstageDoorToBackyard(),
        new Cable(),
        new VendingMachine(),
        // new BandInSofa(),
        // new Scissors(),
        // new Bocadillo(),
        // new Table(),
        // new Glass(),
        // new Dust(),
        // new Coconut()
    ]
};

export class BackstageScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}