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
        {x: 59, y: 216},
        {x: 93, y: 169},
        {x: 143, y: 169},
        {x: 155, y: 155},
        {x: 236, y: 153},
        {x: 249, y: 172},
        {x: 279, y: 171},
        {x: 289, y: 152},
        {x: 420, y: 155},
        {x: 420, y: 171},
        {x: 521, y: 200},
        {x: 528, y: 200},
        {x: 528, y: 220}
    ]),
    things: [
        new Broom(),
        new BackstageDoorToBackyard(),
        new Cable(),
        new VendingMachine(),
        new BandInSofa(),
        new Scissors(),
        new Bocadillo(),
        new Table(),
        new Glass(),
        new Dust(),
        new Coconut()
    ]
};

export class BackstageScene extends Scene {
    constructor() {
        super(sceneOptions);
    }
}