import { IPoint } from './Interfaces';

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

export class Polygon {

    private convexHull: Polygon;

    constructor(private _points: Array<IPoint>) {
        if(!_points.length || _points.length < 3) {
            throw 'ERROR creating polygon, it needs at least 3 points';
        }
    }

    get points(): Array<IPoint> {
        return this._points;
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
}



   

   // 

// Sort the points of P by x-coordinate (in case of a tie, sort by y-coordinate).

// Initialize U and L as empty lists.
// The lists will hold the vertices of upper and lower hulls respectively.

// for i = 1, 2, ..., n:
//     while L contains at least two points and the sequence of last two points
//             of L and the point P[i] does not make a counter-clockwise turn:
//         remove the last point from L
//     append P[i] to L

// for i = n, n-1, ..., 1:
//     while U contains at least two points and the sequence of last two points
//             of U and the point P[i] does not make a counter-clockwise turn:
//         remove the last point from U
//     append P[i] to U

// Remove the last point of each list (it's the same as the first point of the other list).
// Concatenate L and U to obtain the convex hull of P.
// Points in the result will be listed in counter-clockwise order.