import { Command, PathCommand, Vector2 } from '@owlbear-rodeo/sdk';
import rotate from './rotate';
import { roundDownTo, roundUpTo } from './roundTo';
import AABB from './AABB';
import { Line } from './Line';
import Vector from './Vector';

export default class Triangle {
    public readonly p1: Vector2;
    public readonly p2: Vector2;
    public readonly p3: Vector2;

    public constructor (p1: Vector2, p2: Vector2, p3: Vector2) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    public static fromDirectionAndSize (center: Vector2, rads: number, size: number): Triangle {
        const p2 = { x: center.x - size / 2, y: center.y - size };
        const p3 = { x: center.x + size / 2, y: center.y - size };

        return new Triangle(center, rotate(center, p2, rads), rotate(center, p3, rads));
    }

    public get points (): Vector2[] {
        return [this.p1, this.p2, this.p3];
    }

    public get lines (): Line[] {
        return [
            new Line(this.p1, this.p2),
            new Line(this.p2, this.p3),
            new Line(this.p3, this.p1),
        ];
    }

    public get area (): number {
        const a = this.lines[0].length;
        const b = this.lines[1].length;
        const c = this.lines[2].length;

        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    public intersectsSquareAmount (square: AABB): number {
        // Work out the polygon that intersects the two.
        const newPolygon: Vector2[] = [];

        // Find any points of the triangle that are inside the square.
        for (const point of this.points) {
            if (square.containsPoint(point.x, point.y))
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
        const center = {
            x: newPolygon.map((point) => point.x).reduce((a, b) => a + b, 0) / newPolygon.length,
            y: newPolygon.map((point) => point.y).reduce((a, b) => a + b, 0) / newPolygon.length,
        };
        newPolygon.sort((a, b) => {
            const aAngle = new Line(center, a).angle;
            const bAngle = new Line(center, b).angle;
            if (aAngle === bAngle)
                return 0;
            return aAngle < bAngle ? -1 : 1;
        });

        // Split it into triangles and calculate the area.
        let polygonArea = 0.0;
        for (let i = 0; i < newPolygon.length; i++) {
            const p1 = newPolygon[i];
            const p2 = newPolygon[(i + 1) % newPolygon.length];

            const triangle = new Triangle(center, p1, p2);
            polygonArea += triangle.area;
        }

        // Compare to the area of the square.
        return polygonArea / square.area * 100;
    }

    // Forumla from https://stackoverflow.com/questions/13300904/determine-whether-point-lies-inside-triangle/13301035#13301035
    public containsPoint (point: Vector2): boolean {
        const alpha = ((this.p2.y - this.p3.y) * (point.x - this.p3.x) + (this.p3.x - this.p2.x) * (point.y - this.p3.y)) /
            ((this.p2.y - this.p3.y) * (this.p1.x - this.p3.x) + (this.p3.x - this.p2.x) * (this.p1.y - this.p3.y));
        const beta = ((this.p3.y - this.p1.y) * (point.x - this.p3.x) + (this.p1.x - this.p3.x) * (point.y - this.p3.y)) /
            ((this.p2.y - this.p3.y) * (this.p1.x - this.p3.x) + (this.p3.x - this.p2.x) * (this.p1.y - this.p3.y));
        const gamma = 1.0 - alpha - beta;

        return alpha > 0 && beta > 0 && gamma > 0;
    }

    public get pathCommand (): PathCommand[] {
        return [
            [Command.MOVE, this.p1.x, this.p1.y],
            [Command.LINE, this.p2.x, this.p2.y],
            [Command.LINE, this.p3.x, this.p3.y],
            [Command.CLOSE],
        ];
    }

    public get center (): Vector {
        return new Vector({
            x: (this.p1.x + this.p2.x + this.p3.x) / 3,
            y: (this.p1.y + this.p2.y + this.p3.y) / 3,
        });
    }

    public getBounds (chunk: number = 1): AABB {
        const minX = roundDownTo(Math.min(this.p1.x, this.p2.x, this.p3.x), chunk);
        const maxX = roundUpTo(Math.max(this.p1.x, this.p2.x, this.p3.x), chunk);
        const minY = roundDownTo(Math.min(this.p1.y, this.p2.y, this.p3.y), chunk);
        const maxY = roundUpTo(Math.max(this.p1.y, this.p2.y, this.p3.y), chunk);
        return new AABB(minX, minY, maxX - minX, maxY - minY);
    }
}
