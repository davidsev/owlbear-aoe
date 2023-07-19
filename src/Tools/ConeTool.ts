import { getId } from '../Util/getId';
import { BaseTool } from './BaseTool';
import { PathCommand } from '@owlbear-rodeo/sdk';
import { Triangle } from '../Util/Triangle';
import { AABB } from '../Util/AABB';
import { Direction } from '../Util/Vector';
import { PathSimplifier } from '../Util/PathSimplifier';
import { Line } from '../Util/Line';
import { ConeMode } from '../Metadata';

export class ConeTool extends BaseTool {

    readonly label = 'Cone';
    readonly icon = '/icons/cone.svg';
    readonly id = getId('cone');

    protected getShape (): Triangle | null {
        const line = new Line(this.currentPosition, this.roundedCenter);
        const angle = line.vector.angle;
        if (!angle || !this.roundedDistance)
            return null;
        return Triangle.fromDirectionAndSize(this.roundedCenter, angle, this.roundedDistance);
    }

    protected buildAreaPathCommand (triangle: Triangle): PathCommand[] {
        if (this.roomMetadata.coneMode == ConeMode.TOKEN)
            return this.buildAreaPathCommandToken(triangle).commands;
        else
            return this.buildAreaPathCommandIntersection(triangle).commands;
    }

    private buildAreaPathCommandIntersection (triangle: Triangle): PathSimplifier {
        // Work out the bounding square for our search area.
        const bounds = triangle.getBounds(this.dpi);

        // Check every square.
        const path = new PathSimplifier();
        let threshold = this.roomMetadata.coneOverlapThreshold;
        if (!Number.isFinite(threshold))
            threshold = 0;
        for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
            for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
                const square = new AABB(x, y, this.dpi, this.dpi);
                if (triangle.intersectsSquareAmount(square) > threshold) {
                    path.addSquare(square);
                }
            }
        }

        return path;
    }

    private buildAreaPathCommandToken (triangle: Triangle): PathSimplifier {

        // Work out which direction to look in.
        const line = new Line(this.roundedCenter, this.currentPosition);
        const direction4 = line.vector.direction4;
        const direction8 = line.vector.direction8;
        if (direction4 === null || direction8 === null)
            return new PathSimplifier();
        const isDiagonal = [Direction.UPRIGHT, Direction.UPLEFT, Direction.DOWNRIGHT, Direction.DOWNLEFT].includes(direction8);

        // Work out which axis to be centered on.
        // If it's diagonal, we want to be centered on the nearest axis, and will reduce the number of tokens as we move away.
        // If it's not diagonal, we want to be centered on the furthest axis, and will increase the number of tokens as we move away.
        let axis: '+x' | '+y' | '-x' | '-y' | null = null;
        if (direction8 == Direction.UP) axis = '-y';
        if (direction8 == Direction.DOWN) axis = '+y';
        if (direction8 == Direction.LEFT) axis = '-x';
        if (direction8 == Direction.RIGHT) axis = '+x';
        if (direction8 == Direction.UPRIGHT && direction4 == Direction.UP) axis = '+x';
        if (direction8 == Direction.UPRIGHT && direction4 == Direction.RIGHT) axis = '-y';
        if (direction8 == Direction.UPLEFT && direction4 == Direction.UP) axis = '-x';
        if (direction8 == Direction.UPLEFT && direction4 == Direction.LEFT) axis = '-y';
        if (direction8 == Direction.DOWNRIGHT && direction4 == Direction.DOWN) axis = '+x';
        if (direction8 == Direction.DOWNRIGHT && direction4 == Direction.RIGHT) axis = '+y';
        if (direction8 == Direction.DOWNLEFT && direction4 == Direction.DOWN) axis = '-x';
        if (direction8 == Direction.DOWNLEFT && direction4 == Direction.LEFT) axis = '+y';

        if (axis === null)
            throw new Error(`Axis is null:  direction8: ${direction8}, direction4: ${direction4}, isDiagonal: ${isDiagonal}, line: ${line}`);

        // Build a grid of squares to check, in rows.  The first row is nearest the axis.
        let squares: AABB[][] = [];
        if (axis == '+x') {
            for (let x = this.roundedCenter.x; x < this.roundedCenter.x + this.roundedDistance; x += this.dpi) {
                let row: AABB[] = [];
                for (let y = this.roundedCenter.y - this.roundedDistance; y < this.roundedCenter.y + this.roundedDistance; y += this.dpi)
                    row.push(new AABB(x, y, this.dpi, this.dpi));
                squares.push(row);
            }
        } else if (axis == '-x') {
            for (let x = this.roundedCenter.x - this.dpi; x >= this.roundedCenter.x - this.roundedDistance; x -= this.dpi) {
                let row: AABB[] = [];
                for (let y = this.roundedCenter.y - this.roundedDistance; y < this.roundedCenter.y + this.roundedDistance; y += this.dpi)
                    row.push(new AABB(x, y, this.dpi, this.dpi));
                squares.push(row);
            }
        } else if (axis == '+y') {
            for (let y = this.roundedCenter.y; y < this.roundedCenter.y + this.roundedDistance; y += this.dpi) {
                let row: AABB[] = [];
                for (let x = this.roundedCenter.x - this.roundedDistance; x < this.roundedCenter.x + this.roundedDistance; x += this.dpi)
                    row.push(new AABB(x, y, this.dpi, this.dpi));
                squares.push(row);
            }
        } else if (axis == '-y') {
            for (let y = this.roundedCenter.y - this.dpi; y >= this.roundedCenter.y - this.roundedDistance; y -= this.dpi) {
                let row: AABB[] = [];
                for (let x = this.roundedCenter.x - this.roundedDistance; x < this.roundedCenter.x + this.roundedDistance; x += this.dpi)
                    row.push(new AABB(x, y, this.dpi, this.dpi));
                squares.push(row);
            }
        }

        // We currently have the line nearest the axis in row one, which will get one token.
        // If it's diagonal we want it the other way around.
        if (isDiagonal)
            squares = squares.reverse();

        // Find the most intersected squares on each row.
        const path = new PathSimplifier();
        for (const [rowIndex, row] of squares.entries()) {
            const intersection = (square: AABB) => triangle.intersectsSquareAmount(square);
            const bestSquares = this.maxNofArray(row.filter(intersection), intersection, rowIndex + 1);
            path.addSquares(bestSquares);
        }

        return path;
    }

    private maxNofArray<T> (items: T[], getValue: (item: T) => number, count: number = 1): T[] {

        // Get the value of each item.
        const values = new Map<T, number>();
        for (const item of items)
            values.set(item, getValue(item));

        // Sort the items by their value.
        const sortedValues = [...values.entries()].sort((a, b) => b[1] - a[1]);

        // Return the top n items.
        return sortedValues.slice(0, count).map(x => x[0]);
    }
}
