import { Vector2 } from '@owlbear-rodeo/sdk';

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export class Vector implements Vector2 {

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
        return this.x * rhs.x + this.y * rhs.y;
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

    public equals (rhs: Vector2): boolean {
        return this.x === rhs.x && this.y === rhs.y;
    }

    public toString (): string {
        return `(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`;
    }

    /** Returns the angle of the vector in radians, from -PI to PI
     *  Right is 0, negative angles are counter-clockwise, so 0.5PI is -ve y (up) and -0.5PI is +ve y (down)
     */
    public get angle (): number | null {
        if (this.x == 0 && this.y == 0)
            return null;
        return Math.atan2(this.y, this.x);
    }

    /** Returns the direction of the vector, or null if the vector is zero.  Returns just the four main directions.
     *  45deg lines prioritize up and down over left and right. */
    public get direction4 (): Direction | null {
        const angle = this.angle;
        if (angle === null)
            return null;
        if (Math.abs(angle) < Math.PI * 0.25)
            return Direction.RIGHT;
        if (Math.abs(angle) > Math.PI * 0.75)
            return Direction.LEFT;
        if (angle < 0)
            return Direction.UP;
        return Direction.DOWN;
    }

}
