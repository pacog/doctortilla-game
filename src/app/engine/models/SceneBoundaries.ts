import { IPoint } from '../utils/Interfaces';

export interface IBoundariesConfig {
    minY: number,
    maxY: number,
    minX: number,
    maxX: number
}

export class SceneBoundaries {

    constructor(private config: IBoundariesConfig) {}

    getPositionInside(IPoint): IPoint {
        let x = Math.max(this.config.minX, IPoint.x);
        x = Math.min(this.config.maxX, x);
        let y = Math.max(this.config.minY, IPoint.y);
        y = Math.min(this.config.maxY, y);

        return {
            x: Math.round(x),
            y: Math.round(y)
        };

    }
}