import { getId } from '../Util/getId';
import { BaseTool } from './BaseTool';
import { PathCommand } from '@owlbear-rodeo/sdk';
import { AABB } from '../Util/AABB';
import { PathSimplifier } from '../Util/PathSimplifier';
import { Circle } from '../Util/Circle';

export class CircleTool extends BaseTool {

    readonly label = 'Circle';
    readonly icon = '/icons/circle.svg';
    readonly id = getId('circle');

    protected getShape (): Circle | null {
        if (!this.roundedDistance)
            return null;
        return new Circle(this.roundedCenter, this.roundedDistance);
    }

    protected buildAreaPathCommand (): PathCommand[] {
        // Work out the bounding square for our search area.
        const bounds = new AABB(
            this.roundedCenter.x - this.roundedDistance,
            this.roundedCenter.y - this.roundedDistance,
            this.roundedDistance * 2,
            this.roundedDistance * 2,
        );

        // Check every square.
        const path = new PathSimplifier();
        for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
            for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
                const square = new AABB(x, y, this.dpi, this.dpi);
                const distance = this.roundedCenter.distanceTo(square.center);
                if (distance <= this.roundedDistance) {
                    path.addSquare(square);
                }
            }
        }

        return path.commands;
    }
}
