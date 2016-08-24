import { IPoint } from '../utils/Interfaces';
import { Polygon } from '../utils/Polygon';
import { phaserGame } from '../state/PhaserGame.singleton';


const SHOULD_PAINT = false;

export class SceneBoundaries {

    private graphics: Phaser.Graphics;
    private boundingGraphics: Phaser.Graphics;

    constructor(private config: Polygon) {}

    getPositionInside(point: IPoint): IPoint {
        if(this.polygon.isPointInside(point)) {
            return point;
        }
        return this.polygon.getClosestPointTo(point);
    }

    get polygon(): Polygon {
        return this.config;
    }

    paint(): void {
        if(SHOULD_PAINT) {
            this.graphics = this.paintPolygon(this.config, 0xFF3300, 0xffd900);
            this.boundingGraphics = this.paintPolygon(this.config.getConvexHull(), 0x0033FF, 0x00d9ff);
        }
    }

    unpaint(): void {
        if(this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    paintPolygon(polygon: Polygon, fillColor: number, lineColor: number): Phaser.Graphics {
        let points = polygon.points;
        let graphics = phaserGame.value.add.graphics(0, 0);
        graphics.beginFill(fillColor, 0.5);
        graphics.lineStyle(1, lineColor, 1);
        
        graphics.moveTo(points[0].x, points[0].y);

        for(let i=1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.endFill();

        return graphics;
    } 
}