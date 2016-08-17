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
        {x: 142, y: 158},
        {x: 130, y: 174},
        {x: 195, y: 171},
        {x: 213, y: 158},
        {x: 229, y: 158},
        {x: 222, y: 176},
        {x: 308, y: 180},
        {x: 332, y: 158},
        {x: 465, y: 158},
        {x: 469, y: 183},
        {x: 494, y: 193},
        {x: 553, y: 189},
        {x: 569, y: 181},
        {x: 568, y: 158},
        {x: 608, y: 160},
        {x: 627, y: 185},
        {x: 691, y: 184},
        {x: 706, y: 202},
        {x: 762, y: 200},
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