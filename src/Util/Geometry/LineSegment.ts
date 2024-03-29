import { Vector2 } from '@owlbear-rodeo/sdk';
import { AABB } from '../Shapes/AABB';
import { Vector } from './Vector';

export class LineSegment {
    public readonly p1: Vector;
    public readonly p2: Vector;

    public constructor (p1: Vector2, p2: Vector2) {
        // Make sure the points aren't equal
        if (p1.x === p2.x && p1.y === p2.y)
            throw new Error('Cannot create a line with two identical points');

        // Normalize the direction.  We don't really care as long as it's consistent, so smallest X wins, or smallest Y if X is equal.
        if (p1.x < p2.x || (p1.x === p2.x && p1.y < p2.y)) {
            this.p1 = new Vector(p1);
            this.p2 = new Vector(p2);
        } else {
            this.p1 = new Vector(p2);
            this.p2 = new Vector(p1);
        }
    }

    public get points (): Vector[] {
        return [this.p1, this.p2];
    }

    public get boundingBox (): AABB {
        return new AABB(
            Math.min(this.p1.x, this.p2.x),
            Math.min(this.p1.y, this.p2.y),
            Math.abs(this.p1.x - this.p2.x),
            Math.abs(this.p1.y - this.p2.y),
        );
    }

    public get length (): number {
        return Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
    }

    public get midpoint (): Vector {
        return new Vector({
            x: (this.p1.x + this.p2.x) / 2,
            y: (this.p1.y + this.p2.y) / 2,
        });
    }

    // algorithm from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
    public getIntersection (line2: LineSegment): Vector | null {

        const p = this.p1;
        const r = this.p2.sub(this.p1);
        const q = line2.p1;
        const s = line2.p2.sub(line2.p1);

        // r × s
        const r_s = r.cross(s);
        // (q − p) × r
        const q_p_r = q.sub(p).cross(r);

        if (isZeroIsh(r_s) && isZeroIsh(q_p_r)) {
            // t0 = (q − p) · r / (r · r)
            const t0 = q.sub(p).dot(r) / r.dot(r);

            // t1 = (q + s − p) · r / (r · r) = t0 + s · r / (r · r)
            const t1 = t0 + s.dot(r) / r.dot(r);

            //const t1 = q.add(s.sub(p)).dot(r) / r.dot(r);
            //const t0 = t1 - s.dot(r) / r.dot(r);

            // Overlap:  return the middle of the shortest line because that's probably not too bad?
            // Should really return both ends of the overlap, but that's a major PITA
            if (t0 >= 0 && t0 <= 1 || t1 >= 0 && t1 <= 1) {
                if (this.length < line2.length)
                    return this.midpoint;
                else
                    return line2.midpoint;
            }

            // Same line but non-overlapping segments, so no intersection
            return null;
        }

        // Parallel but separate, so no intersection
        if (isZeroIsh(r_s) && !isZeroIsh(q_p_r)) {
            return null;
        }

        // t = (q − p) × s / (r × s)
        const t = q.sub(p).cross(s) / r.cross(s);

        // u = (q − p) × r / (r × s)
        const u = q.sub(p).cross(r) / r.cross(s);

        // Intersection
        if (!isZeroIsh(r_s) && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return new Vector({
                x: this.p1.x + (this.p2.x - this.p1.x) * t,
                y: this.p1.y + (this.p2.y - this.p1.y) * t,
            });
        }

        return null;
    }

    public toString (): string {
        return `Line(${this.p1.x},${this.p1.y} -> ${this.p2.x},${this.p2.y})`;
    }
}

function isZeroIsh (x: number) {
    return Math.abs(x) < 1 / 1000000;
}
