import { Vector2 } from '@owlbear-rodeo/sdk';
import { rotate } from '../Geometry/rotate';
import { AABB } from './AABB';
import { sortPointsClockwise } from '../Geometry/sortPointsClockwise';
import { Polygon } from './Polygon';
import { Vector } from '../Geometry/Vector';

export class Triangle extends Polygon {

    public constructor (p1: Vector2, p2: Vector2, p3: Vector2) {
        super([p1, p2, p3]);
    }

    public get p1 (): Vector {
        return this.points[0];
    }

    public get p2 (): Vector {
        return this.points[1];
    }

    public get p3 (): Vector {
        return this.points[2];
    }

    public static fromDirectionAndSize (center: Vector2, rads: number, size: number): Triangle {
        const p2 = { x: center.x - size / 2, y: center.y - size };
        const p3 = { x: center.x + size / 2, y: center.y - size };

        return new Triangle(center, rotate(center, p2, rads), rotate(center, p3, rads));
    }

    public intersectsSquareAmount (square: AABB): number {
        // Work out the polygon that intersects the two.
        const newPolygon: Vector2[] = [];

        // Find any points of the triangle that are inside the square.
        for (const point of this.points) {
            if (square.containsPoint(point))
                newPolygon.push(point);
        }
        // Ditto for points of the square that are inside the triangle.
        for (const point of square.points) {
            if (this.containsPoint(point))
                newPolygon.push(point);
        }

        // And find any points where the lines intersect.
        for (const tLine of this.lines) {
            for (const sLine of square.lines) {
                const intersection = tLine.getIntersection(sLine);
                if (intersection)
                    newPolygon.push(intersection);
            }
        }

        // Then sort our points to be in order.
        const sortedPoints = sortPointsClockwise(newPolygon);

        // If there's not enough / any overlap, then no intersection.
        if (sortedPoints.length < 3) {
            return 0;
        }

        // Otherwise we need the area of the polygon.
        // If it's a triangle just do that.
        let polygonArea = 0.0;
        if (sortedPoints.length === 3) {
            polygonArea = (new Triangle(sortedPoints[0], sortedPoints[1], sortedPoints[2])).area;
        }

        // Otherwise we need to split it into triangles and add the areas.
        const center = AABB.boundingBox(sortedPoints).center;
        for (let i = 0; i < sortedPoints.length; i++) {
            const p1 = sortedPoints[i];
            const p2 = sortedPoints[(i + 1) % sortedPoints.length];

            const triangle = new Triangle(center, p1, p2);
            polygonArea += triangle.area;
        }

        // Compare to the area of the square.
        return polygonArea / square.area * 100;
    }

    // Formula from https://stackoverflow.com/questions/13300904/determine-whether-point-lies-inside-triangle/13301035#13301035
    public containsPoint (point: Vector2): boolean {
        const alpha = ((this.p2.y - this.p3.y) * (point.x - this.p3.x) + (this.p3.x - this.p2.x) * (point.y - this.p3.y)) /
            ((this.p2.y - this.p3.y) * (this.p1.x - this.p3.x) + (this.p3.x - this.p2.x) * (this.p1.y - this.p3.y));
        const beta = ((this.p3.y - this.p1.y) * (point.x - this.p3.x) + (this.p1.x - this.p3.x) * (point.y - this.p3.y)) /
            ((this.p2.y - this.p3.y) * (this.p1.x - this.p3.x) + (this.p3.x - this.p2.x) * (this.p1.y - this.p3.y));
        const gamma = 1.0 - alpha - beta;

        return alpha > 0 && beta > 0 && gamma > 0;
    }

    public toString (): string {
        return `Triangle(${this.p1}, ${this.p2}, ${this.p3})`;
    }
}
