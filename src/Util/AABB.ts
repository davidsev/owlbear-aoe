import { Line } from './Line';
import Vector from './Vector';
import { Command, PathCommand } from '@owlbear-rodeo/sdk';

export default class AABB {

    public readonly x: number;
    public readonly y: number;
    public readonly w: number;
    public readonly h: number;

    public constructor (x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public get p1 (): Vector {
        return new Vector({ x: this.x, y: this.y });
    }

    public get p2 (): Vector {
        return new Vector({ x: this.x + this.w, y: this.y });
    }

    public get p3 (): Vector {
        return new Vector({ x: this.x + this.w, y: this.y + this.h });
    }

    public get p4 (): Vector {
        return new Vector({ x: this.x, y: this.y + this.h });
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

    public get points (): Vector[] {
        return [this.p1, this.p2, this.p3, this.p4];
    }

    public get lines (): Line[] {
        return [
            new Line(this.p1, this.p2),
            new Line(this.p2, this.p3),
            new Line(this.p3, this.p4),
            new Line(this.p4, this.p1),
        ];
    }

    public get center (): Vector {
        return new Vector({
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        });
    }

    public get area (): number {
        return this.w * this.h;
    }

    public get pathCommand (): PathCommand[] {
        return [
            [Command.MOVE, this.p1.x, this.p1.y],
            [Command.LINE, this.p2.x, this.p2.y],
            [Command.LINE, this.p3.x, this.p3.y],
            [Command.LINE, this.p4.x, this.p4.y],
            [Command.CLOSE],
        ];
    }

    public containsPoint (x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }
}
