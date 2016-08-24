import { Scene } from '../../engine/models/Scene';
import { BackyardDoorToBackstage } from './BackyardDoorToBackstage';
import { Flowers } from './Flowers';
import { Bili } from './Bili';
import { LampBackyard } from './LampBackyard';
import { Moon } from './Moon';
import { Star } from './Star';
import { Polygon } from '../../engine/utils/Polygon';
import { IPoint } from '../../engine/utils/Interfaces';

const sceneOptions = {
    id: 'BACKYARD',
    backgroundId: 'BACKYARD_BG',
    boundariesConfig: new Polygon([
        {x: 55, y: 216},
        {x: 117, y: 164},
        {x: 415, y: 164},
        {x: 415, y: 216}
    ]),
    things: [
        new BackyardDoorToBackstage(),
        new Flowers(),
        new Bili(),
        new LampBackyard(),
        new Moon()
    ]
};


const STAR_NUMBER = 70;
const SKY_START : IPoint = { x: 108, y: 1};
const SKY_END : IPoint = { x: 436, y: 74};
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 0.8;

export class BackyardScene extends Scene {
    private stars: Array<Star>;

    constructor() {
        super(sceneOptions);
        
    }

    show() {
        super.show();
        this.createSky();
    }

    destroy() {
        super.destroy();
        this.destroySky();
    }

    private createSky(): void {
        this.stars = [];

        for(let i=0; i<STAR_NUMBER; i++) {
            let newStar = new Star({
                x: SKY_START.x + Math.random()*(SKY_END.x - SKY_START.x),
                y: SKY_START.y + Math.random()*(SKY_END.y - SKY_START.y),
                id: 'star_' + i,
                opacity: MIN_OPACITY + Math.random()*(MAX_OPACITY - MIN_OPACITY)
            });
            newStar.show();
            this.stars.push(newStar);
        }
    }

    private destroySky(): void {
        this.stars = this.stars || [];
        this.stars.forEach(star => star.destroy());
        this.stars = [];
    }
}