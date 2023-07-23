import { Vector2 } from '@owlbear-rodeo/sdk';
import { rotate, Vector } from '../Geometry';
import { Polygon } from '.';

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
