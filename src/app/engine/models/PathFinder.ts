import { IPoint } from '../utils/Interfaces';
import { SceneBoundaries } from './SceneBoundaries';

class PathFinder {
    getPath(origin: IPoint, destination: IPoint, boundaries: SceneBoundaries): Array<IPoint> {
        var insideDestination = boundaries.getPositionInside(destination);
        var concaveVertex = boundaries.polygon.getConcaveVertex();

        return [insideDestination];
    }
}

export const pathFinder = new PathFinder();