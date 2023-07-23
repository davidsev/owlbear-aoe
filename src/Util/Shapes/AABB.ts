import { Vector } from '../Geometry';
import { Vector2 } from '@owlbear-rodeo/sdk';
import { Polygon } from '.';
import { roundDownTo, roundUpTo } from '../roundTo';

export class AABB extends Polygon {

    public readonly x: number;
    public readonly y: number;
    public readonly w: number;
    public readonly h: number;

    public constructor (x: number, y: number, w: number, h: number) {
        super([
            new Vector({ x: x, y: y }),
            new Vector({ x: x + w, y: y }),
            new Vector({ x: x + w, y: y + h }),
            new Vector({ x: x, y: y + h }),
        ]);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public static boundingBox (points: Vector2[], chunk: number = 1): AABB {
        const minX = roundDownTo(Math.min(...points.map(v => v.x)), chunk);
        const maxX = roundUpTo(Math.max(...points.map(v => v.x)), chunk);
        const minY = roundDownTo(Math.min(...points.map(v => v.y)), chunk);
        const maxY = roundUpTo(Math.max(...points.map(v => v.y)), chunk);
        return new AABB(minX, minY, maxX - minX, maxY - minY);
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

    public get minX (): number {
        return Math.min(this.p1.x, this.p2.x, this.p3.x, this.p4.x);
    }

    public get maxX (): number {
        return Math.max(this.p1.x, this.p2.x, this.p3.x, this.p4.x);
    }

    public get minY (): number {
        return Math.min(this.p1.y, this.p2.y, this.p3.y, this.p4.y);
    }

    public get maxY (): number {
        return Math.max(this.p1.y, this.p2.y, this.p3.y, this.p4.y);
    }

    public get area (): number {
        return this.w * this.h;
    }

    public containsPoint (point: Vector2): boolean {
        return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
    }

    public toString (): string {
        return `AABB(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
    }

    public iterateGrid (chunkSize: number): AABB[] {
        const points: AABB[] = [];
        const box = this.getBounds(chunkSize);
        for (let x = box.x; x < box.x + box.w; x += chunkSize) {
            for (let y = box.y; y < box.y + box.h; y += chunkSize) {
                points.push(new AABB(x, y, chunkSize, chunkSize));
            }
        }
        return points;
    }
}
