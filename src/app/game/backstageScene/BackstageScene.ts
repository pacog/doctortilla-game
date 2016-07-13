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
import { Glass } from './GlassInTable';

const sceneOptions = {
    id: 'BACKSTAGE',
    backgroundId: 'BACKSTAGE_BG',
    boundariesConfig: {
        minY: 310 / 2,
        maxY: 450 / 2,
        minX: 180 / 2,
        maxX: 1200 / 2
    },
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