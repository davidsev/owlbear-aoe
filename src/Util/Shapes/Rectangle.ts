import { Vector2 } from '@owlbear-rodeo/sdk';
import { Polygon } from '.';
import { Line, Vector } from '../Geometry';

export class Rectangle extends Polygon {

    public constructor (p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2) {
        super([p1, p2, p3, p4]);

        // Make sure it's actually a rectangle.
        // Check the opposite sides are the same length.
        if (Math.abs(this.lines[0].length - this.lines[2].length) > 0.001
            || Math.abs(this.lines[1].length - this.lines[3].length) > 0.001) {
            throw new Error('Rectangle is not a rectangle (sides are not the same length)');
        }
        // It might still be a parallelogram, so check the diagonals too.
        const d1 = new Line(this.points[0], this.points[2]);
        const d2 = new Line(this.points[1], this.points[3]);
        if (Math.abs(d1.length - d2.length) > 0.001) {
            throw new Error('Rectangle is not a rectangle (diagonals are not the same length)');
        }
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

    public get p4 (): Vector {
        return this.points[3];
    }

    public static fromLineAndWidth (line: Line, width: number): Rectangle {
        const p1 = line.p1.add(line.orthogonalVector.normalised.scale(width / 2));
        const p2 = line.p1.add(line.orthogonalVector.normalised.scale(-width / 2));
        const p3 = line.p2.add(line.orthogonalVector.normalised.scale(-width / 2));
        const p4 = line.p2.add(line.orthogonalVector.normalised.scale(width / 2));
        return new Rectangle(p1, p2, p3, p4);
    }

    get area (): number {
        return this.lines[0].length * this.lines[1].length;
    }

    // Formula from https://stackoverflow.com/a/2763387
    public containsPoint (point: Vector2): boolean {
        const vec = new Vector(point);
        const ab = this.p2.sub(this.p1);
        const am = vec.sub(this.p1);
        const bc = this.p3.sub(this.p2);
        const bm = vec.sub(this.p2);
        const abam = ab.dot(am);
        const abab = ab.dot(ab);
        const bcbm = bc.dot(bm);
        const bcbc = bc.dot(bc);
        return 0 <= abam && abam <= abab && 0 <= bcbm && bcbm <= bcbc;
    }

    public toString (): string {
        return `Rectangle(${this.p1}, ${this.p2}, ${this.p3}, ${this.p4})`;
    }
}
