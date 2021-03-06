import { IPoint } from './Interfaces';

function sqr(x: number): number {
    return x * x;
}

function distance2(pointA: IPoint, pointB: IPoint): number {
    return sqr(pointA.x - pointB.x) + sqr(pointA.y - pointB.y);
}

export class Segment {

    constructor(public pointA: IPoint, public pointB: IPoint) {}

    get length(): number {
        return Math.sqrt(distance2(this.pointA, this.pointB));
    }

    //Based on http://stackoverflow.com/a/1501725/3493388
    distanceToPoint(point: IPoint): number {
        return Math.sqrt(this.distance2ToPoint(point));
    }

    distance2ToPoint(point: IPoint): number {
        var length2 = distance2(this.pointA, this.pointB);
        if(length2 === 0) {
            return distance2(this.pointA, this.pointB);
        }
        var t = ((point.x - this.pointA.x) * (this.pointB.x - this.pointA.x) + (point.y - this.pointA.y) * (this.pointB.y - this.pointA.y)) / length2;
        t = Math.max(0, Math.min(1, t));

        return distance2(point, {
            x: this.pointA.x + t * (this.pointB.x - this.pointA.x),
            y: this.pointA.y + t * (this.pointB.y - this.pointA.y)
        });
    }


    //Based on http://www.java2s.com/Code/Java/2D-Graphics-GUI/Returnsclosestpointonsegmenttopoint.htm
    getClosestPointTo(point: IPoint): IPoint {
        let xDelta = this.pointB.x - this.pointA.x;
        let yDelta = this.pointB.y - this.pointA.y;

        if((xDelta === 0) && (yDelta === 0)) {
            return this.pointA; //Line is actually a point
        }

        let u = ((point.x - this.pointA.x) * xDelta + (point.y - this.pointA.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

        if(u < 0) {
            return this.pointA;
        }
        if(u > 1) {
            return this.pointB;
        }
        return {
            x: this.pointA.x + u * xDelta,
            y: this.pointA.y + u * yDelta
        };

    }

    isCrossedBy(segment: Segment): Boolean {
        if(this.isEqual(segment)) {
            return false;
        }
        let line1 = new Phaser.Line(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
        let line2 = new Phaser.Line(segment.pointA.x, segment.pointA.y, segment.pointB.x, segment.pointB.y);

        var otherSegmentInsideThis = line1.pointOnSegment(segment.pointA.x, segment.pointA.y) || line1.pointOnSegment(segment.pointB.x, segment.pointB.y);
        if(otherSegmentInsideThis) {
            return false;
        }
        var thisSegmentInsideOther = line2.pointOnSegment(this.pointA.x, this.pointA.y) || line2.pointOnSegment(this.pointB.x, this.pointB.y);
        if(thisSegmentInsideOther) {
            return false;
        }

        let intersection = line1.intersects(line2, true);

        return !!intersection;
    }

    // private lineToString(line: Phaser.Line): string {
    //     return '[(' + line.start.x + ',' + line.start.y + ')-(' + line.end.x + ',' + line.end.y + ')]';
    // }

    isEqual(segment: Segment): Boolean {
        if(this.pointsAreEqual(this.pointA, segment.pointA) && this.pointsAreEqual(this.pointB, segment.pointB)) {
            return true;
        }
        if(this.pointsAreEqual(this.pointB, segment.pointA) && this.pointsAreEqual(this.pointA, segment.pointB)) {
            return true;
        }
        return false;
    }

    private pointsAreEqual(pointA: IPoint, pointB: IPoint): Boolean {
        return (pointA.x === pointB.x) && (pointA.y === pointB.y);
    }

    // getMiddlePoint(): IPoint {
    //     return {
    //         x: (this.pointA.x + this.pointB.x) / 2,
    //         y: (this.pointA.y + this.pointB.y) / 2
    //     };
    // }


}


// public static Point getClosestPointOnSegment(int sx1, int sy1, int sx2, int sy2, int px, int py)
//   {
//     double xDelta = sx2 - sx1;
//     double yDelta = sy2 - sy1;

//     if ((xDelta == 0) && (yDelta == 0))
//     {
//       throw new IllegalArgumentException("Segment start equals segment end");
//     }

//     double u = ((px - sx1) * xDelta + (py - sy1) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

//     final Point closestPoint;
//     if (u < 0)
//     {
//       closestPoint = new Point(sx1, sy1);
//     }
//     else if (u > 1)
//     {
//       closestPoint = new Point(sx2, sy2);
//     }
//     else
//     {
//       closestPoint = new Point((int) Math.round(sx1 + u * xDelta), (int) Math.round(sy1 + u * yDelta));
//     }

//     return closestPoint;
//   }
// }
