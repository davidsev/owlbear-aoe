import { Command, PathCommand, Vector2 } from '@owlbear-rodeo/sdk';
import { Vector } from './Vector';
import { Line } from './Line';
import { sortPointsClockwise } from './sortPointsClockwise';
import { AABB } from './AABB';
import { Shape } from './Shape';

/** A convex polygon.
 *  Where possible should be using the more specific classes like Triangle, Rectangle, etc.
 */
export class Polygon extends Shape {

    /** The points */
    public readonly points: Vector[];

    /** @param points The points of this polygon, must be sorted into order.  Doesn't matter if clockwise or anti-clockwise. */
    public constructor (points: Vector2[]) {
        super();
        this.points = points.map((point) => new Vector(point));
    }

    /** Create a polygon from a list of points, sorting them into clockwise order. */
    public static fromUnsortedPoints (points: Vector2[]): Polygon {
        return new Polygon(sortPointsClockwise(points));
    }

    public get lines (): Line[] {
        const lines: Line[] = [];
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i];
            const p2 = this.points[(i + 1) % this.points.length];
            lines.push(new Line(p1, p2));
        }
        return lines;
    }

    public get area (): number {

        // Less than 3 points, then 0
        if (this.points.length < 3) {
            return 0;
        }

        // If it's a triangle, use Heron's formula https://www.mathsisfun.com/geometry/herons-formula.html
        // (We can't do b*h/2 because it's not axis aligned)
        if (this.points.length === 3) {
            const a = this.lines[0].length;
            const b = this.lines[1].length;
            const c = this.lines[2].length;

            const s = (a + b + c) / 2;
            const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            // Check if the points are all a straight line.
            if (isNaN(area)) {
                return 0;
            }
            return area;
        }

        // Otherwise we need to split it into triangles and add the areas.
        let polygonArea = 0.0;
        const center = this.center;
        for (const line of this.lines) {
            const triangle = new Polygon([center, line.p1, line.p2]);
            polygonArea += triangle.area;
        }

        return polygonArea;
    }

    public intersectsSquareAmount (square: AABB): number {
        throw new Error('Not implemented');
    }

    public containsPoint (point: Vector2): boolean {
        throw new Error('Not implemented');
    }

    public get pathCommand (): PathCommand[] {
        let command: PathCommand[] = [];
        for (const point of this.points) {
            if (command.length === 0)
                command.push([Command.MOVE, point.x, point.y]);
            else
                command.push([Command.LINE, point.x, point.y]);
        }
        command.push([Command.CLOSE]);

        return command;
    }

    public get center (): Vector {
        let x = 0;
        let y = 0;

        for (const point of this.points) {
            x += point.x;
            y += point.y;
        }
        return new Vector({
            x: x / this.points.length,
            y: y / this.points.length,
        });
    }

    public getBounds (chunk: number = 1): AABB {
        return AABB.boundingBox(this.points, chunk);
    }

    public toString (): string {
        return `Polygon(${this.points.map((point) => point.toString()).join(', ')})`;
    }
}
