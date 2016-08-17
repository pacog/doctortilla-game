import { Scene } from '../../engine/models/Scene';
import { Broom } from './Broom';
import { VendingMachine } from './VendingMachine';
import { BackstageDoorToBackyard } from './BackstageDoorToBackyard';
import { BackstageDoorToStreet } from './BackstageDoorToStreet';
import { BackstageDoorToStage } from './BackstageDoorToStage';
import { BandInSofa } from './BandInSofa';
import { Scissors } from './Scissors';
import { Bocadillo } from './Bocadillo';
import { Cable } from './Cable';
import { Coconut } from './Coconut';
import { Dust } from './DustInTable';
import { Glass } from './Glass';
import { LampLeft } from './LampLeft';
import { LampRight } from './LampRight';
import { FlyCase } from './FlyCase';
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
        
        new BackstageDoorToBackyard(),
        new BackstageDoorToStreet(),
        new BackstageDoorToStage(),
        new Cable(),
        new VendingMachine(),
        new BandInSofa(),
        new LampLeft(),
        new LampRight(),
        new FlyCase(),
        // new Broom(),
        // new Scissors(),
        // new Bocadillo(),
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