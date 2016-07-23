import { IPoint } from '../utils/Interfaces';
import { SceneBoundaries } from './SceneBoundaries';

class PathFinder {
    getPath(origin: IPoint, destination: IPoint, boundaries: SceneBoundaries): Array<IPoint> {
        //TODO do real algorithm
        let point1 = {
            x: Math.random()*300,
            y: Math.random()*300
        };
        let point2 = {
            x: Math.random()*300,
            y: Math.random()*300
        };
        return [point1, point2, destination];
    }
}

export const pathFinder = new PathFinder();