import { AABB, Shape } from '.';
import { Line, Vector } from '../Geometry';
import { Command, PathCommand, Vector2 } from '@owlbear-rodeo/sdk';
import { roundDownTo, roundUpTo } from '../roundTo';

export class Circle extends Shape {

    public readonly center: Vector;
    public readonly radius: number;

    constructor (center: Vector2, radius: number) {
        super();
        this.center = new Vector(center);
        this.radius = radius;
    }

    get area (): number {
        return Math.PI * this.radius * this.radius;
    }

    containsPoint (point: Vector2): boolean {
        return (new Line(this.center, point)).length <= this.radius;
    }

    getBounds (chunk: number = 1): AABB {
        const minX = roundDownTo(this.center.x - this.radius, chunk);
        const maxX = roundUpTo(this.center.x + this.radius, chunk);
        const minY = roundDownTo(this.center.y - this.radius, chunk);
        const maxY = roundUpTo(this.center.y + this.radius, chunk);
        return new AABB(minX, minY, maxX - minX, maxY - minY);
    }

    intersectsSquareAmount (square: AABB): number {
        throw new Error('Not implemented');
    }

    get pathCommand (): PathCommand[] {
        return [
            [Command.MOVE, this.center.x, this.center.y + this.radius],
            [Command.CONIC, this.center.x + this.radius, this.center.y + this.radius, this.center.x + this.radius, this.center.y, Math.PI / 4],
            [Command.CONIC, this.center.x + this.radius, this.center.y - this.radius, this.center.x, this.center.y - this.radius, Math.PI / 4],
            [Command.CONIC, this.center.x - this.radius, this.center.y - this.radius, this.center.x - this.radius, this.center.y, Math.PI / 4],
            [Command.CONIC, this.center.x - this.radius, this.center.y + this.radius, this.center.x, this.center.y + this.radius, Math.PI / 4],
        ];
    }

}
