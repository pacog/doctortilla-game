import { IPoint } from './Interfaces';
import { Segment } from './Segment';

const MIDDLE_POINTS_TO_CHECK = 10;
const MIN_DISTANCE_TO_BE_IN_LINE = 1;

function sorterByXThenY(pointA: IPoint, pointB: IPoint): number {
    if(pointA.x === pointB.x) {
        return pointA.y - pointB.y;
    } else {
        return pointA.x - pointB.x;
    }
}


function cross(pointO: IPoint, pointA: IPoint, pointB: IPoint): number {
    return (pointA.x - pointO.x) * (pointB.y - pointO.y) - (pointA.y - pointO.y) * (pointB.x - pointO.x);
}


function lineSegmentsCross(a: IPoint, b: IPoint, c: IPoint, d: IPoint): Boolean {
    let denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    if (denominator === 0){
        return false;
    }

    let numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    let numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

    if (numerator1 === 0 || numerator2 === 0) {
        return false;
    }

    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r > 0 && r < 1) && (s > 0 && s < 1);
}

export class Polygon {

    private convexHull: Polygon;
    private _segments: Array<Segment>;

    constructor(private _points: Array<IPoint>) {
        if(!_points.length || _points.length < 3) {
            throw 'ERROR creating polygon, it needs at least 3 points';
        }
    }

    get points(): Array<IPoint> {
        return this._points;
    }

    get segments(): Array<Segment> {
        if(!this._segments) {
            this.createSegments();
        }
        return this._segments;
    }

    getConvexHull(): Polygon {
        if(!this.convexHull) {
            this.convexHull = this.calculateConvexHull();
        }
        return this.convexHull;
    }

    //Concave vertex are the ones that do not belong to the convexHull
    getConcaveVertex(): Array<IPoint> {
        let convexHull = this.getConvexHull();
        let result: Array<IPoint> = [];

        for(let point of this._points) {
            if(!convexHull.hasPoint(point)) {
                result.push(point);
            }
        }

        return result;
    }

    hasPoint(pointToSearch: IPoint): Boolean {
        for(let point of this._points) {
            if((point.x === pointToSearch.x) && (point.y === pointToSearch.y) ) {
                return true;
            }
        }
        return false;
    }

    isPointInside(point: IPoint): Boolean {
        if(this.hasPoint(point)) {
            return true;
        }
        for(let i=0; i<this.segments.length; i++) {
            if(this.segments[i].distanceToPoint(point) < MIN_DISTANCE_TO_BE_IN_LINE) {
                return true;
            }
        }
        let phaserPolygon = new Phaser.Polygon(this.points.map((eachPoint) => {
            return new Phaser.Point(eachPoint.x, eachPoint.y);
        }));
        return phaserPolygon.contains(point.x, point.y);
    }



    getClosestPointTo(point: IPoint): IPoint {
        var closestSegment = this.getClosestSegment(point);
        return closestSegment.getClosestPointTo(point);
    }

    private getClosestSegment(point: IPoint): Segment {
        let segments = this.segments;
        let closestSegment = this.segments[0];
        let minDistance = closestSegment.distance2ToPoint(point);
        for(let i = 1; i<segments.length; i++) {
            let nextSegment = segments[i];
            let nextDistance = nextSegment.distance2ToPoint(point);
            if(nextDistance < minDistance) {
                closestSegment = nextSegment;
                minDistance = nextDistance;
            }
        }

        return closestSegment;
    }

    pointsCanSeeEachOther(pointA: IPoint, pointB: IPoint): Boolean {
        if(!this.isPointInside(pointA) || !this.isPointInside(pointB)) {
            return false;
        }
        if(!this.middlePointsAreInside(pointA, pointB)) {
            return false;
        }

        let segments = this.segments;
        let segmentBetweenPoints = new Segment(pointA, pointB);
        for(let i=0; i<segments.length; i++) {
            if(segments[i].isCrossedBy(segmentBetweenPoints)) {
                return false;
            }
        }
        return true;
    }

    private middlePointsAreInside(pointA: IPoint, pointB: IPoint, pointsToCheck: number = MIDDLE_POINTS_TO_CHECK): Boolean {
        let point1 = new Phaser.Point(pointA.x, pointA.y);
        let point2 = new Phaser.Point(pointB.x, pointB.y);

        for(let i=1; i<=pointsToCheck; i++) {
            let ratio = i/(pointsToCheck + 1);
            let pointInBetween = Phaser.Point.interpolate(point1, point2, ratio);
            if(!this.isPointInside({ x: pointInBetween.x, y: pointInBetween.y})) {
                return false;
            }
        }
        return true;
        
    }

    // Using https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
    private calculateConvexHull(): Polygon {
        let orderedPoints = Array.from(this._points);
        orderedPoints.sort(sorterByXThenY);

        var lower : Array<IPoint> = [];
        for (var i = 0; i < orderedPoints.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], orderedPoints[i]) <= 0) {
                lower.pop();
            }
            lower.push(orderedPoints[i]);
        }

        var upper : Array<IPoint> = [];
        for (var i = orderedPoints.length - 1; i >= 0; i--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], orderedPoints[i]) <= 0) {
                upper.pop();
            }
            upper.push(orderedPoints[i]);
        }
        upper.pop();
        lower.pop();
        return new Polygon(lower.concat(upper));
    }

    private createSegments(): void {
        this._segments = [];
        for(let i=0; i < (this._points.length - 1); i++) {
            this._segments.push(new Segment(this._points[i], this._points[i+1]));
        }
        this._segments.push(new Segment(this._points[this._points.length - 1], this._points[0]));
    }
}
