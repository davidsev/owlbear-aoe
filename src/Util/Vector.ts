import { Vector2 } from '@owlbear-rodeo/sdk';

export default class Vector implements Vector2 {

    public readonly x: number;
    public readonly y: number;

    constructor (vector: Vector2) {
        this.x = vector.x;
        this.y = vector.y;
    }

    public sub (rhs: Vector2): Vector {
        return new Vector({
            x: this.x - rhs.x,
            y: this.y - rhs.y,
        });
    }

    public add (rhs: Vector2): Vector {
        return new Vector({
            x: this.x + rhs.x,
            y: this.y + rhs.y,
        });
    }

    public dot (rhs: Vector2): number {
        return this.x * rhs.x + this.y + rhs.y;
    }

    public cross (rhs: Vector2): number {
        return this.x * rhs.y - this.y * rhs.x;
    }

    public roundToNearest (n: number): Vector {
        return new Vector({
            x: Math.round(this.x / n) * n,
            y: Math.round(this.y / n) * n,
        });
    }

    public roundUpToNearest (n: number): Vector {
        return new Vector({
            x: Math.ceil(this.x / n) * n,
            y: Math.ceil(this.y / n) * n,
        });
    }

    public roundDownToNearest (n: number): Vector {
        return new Vector({
            x: Math.floor(this.x / n) * n,
            y: Math.floor(this.y / n) * n,
        });
    }

    public distanceTo (rhs: Vector2): number {
        return Math.sqrt(Math.pow(this.x - rhs.x, 2) + Math.pow(this.y - rhs.y, 2));
    }

    public angleTo (rhs: Vector2): number {
        return Math.atan2(rhs.y - this.y, rhs.x - this.x);
    }

    public equals (rhs: Vector2): boolean {
        return this.x === rhs.x && this.y === rhs.y;
    }

    public toString (): string {
        return `(${this.x}, ${this.y})`;
    }
}
