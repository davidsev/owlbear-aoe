import { AABB } from '../Shapes';
import { Command, PathCommand } from '@owlbear-rodeo/sdk';
import { Vector } from './Vector';
import { Line } from './Line';

export class PathSimplifier {
    public readonly squares: AABB[] = [];

    public addSquare (square: AABB): this {
        this.squares.push(square);
        return this;
    }

    public addSquares (squares: AABB[]): this {
        this.squares.push(...squares);
        return this;
    }

    public add (x: number, y: number, w: number, h: number): this {
        this.addSquare(new AABB(x, y, w, h));
        return this;
    }

    public simplify (): Vector[] {
        if (!this.squares.length)
            return [];

        // Count how many times each line shows up
        const lineCounts = new Map<string, [Line, number]>();
        for (const square of this.squares) {
            for (const line of square.lines) {
                const key = line.normaliseDirection().toString();
                const [_, count] = lineCounts.get(key) ?? [line, 0];
                lineCounts.set(key, [line, count + 1]);
            }
        }

        // If a line shows up more than once, then it's internal and can be removed.
        const lines: Line[] = [];
        for (const [line, count] of lineCounts.values()) {
            if (count === 1) {
                lines.push(line);
            }
        }

        if (!lines.length)
            return [];

        // Sort the lines into order.  Pick a starting point and then find the next line that has that point etc.
        const points: Vector[] = [];
        const firstLine = lines.shift() as Line; // We know there's at least one line, so this can't be undefined.
        points.push(firstLine.p1, firstLine.p2);
        let currentPoint = firstLine.p2;

        while (lines.length) {
            // Find a line with our current point
            const nextLine = lines.find(line => line.p1.equals(currentPoint) || line.p2.equals(currentPoint));
            if (!nextLine)
                throw new Error('Could not find next line.  Should never happen?');

            // Remove the line from the list
            lines.splice(lines.indexOf(nextLine), 1);

            // Add the new point to the list and make it the current point
            if (nextLine.p1.equals(currentPoint)) {
                points.push(nextLine.p2);
                currentPoint = nextLine.p2;
            } else {
                points.push(nextLine.p1);
                currentPoint = nextLine.p1;
            }
        }

        return points;
    }

    public get commands (): PathCommand[] {
        const commands: PathCommand[] = [];

        const points = this.simplify();
        const firstPoint = points.shift();
        if (!firstPoint)
            return [];

        commands.push([Command.MOVE, firstPoint.x, firstPoint.y]);
        for (const point of this.simplify()) {
            commands.push([Command.LINE, point.x, point.y]);
        }
        commands.push([Command.CLOSE]);

        return commands;
    }
}
