import { getId } from '../Util/getId';
import { BaseTool } from './BaseTool';
import { PathCommand } from '@owlbear-rodeo/sdk';
import { AABB } from '../Util/Shapes/AABB';
import { PathSimplifier } from '../Util/Geometry/PathSimplifier';
import { Circle } from '../Util/Shapes/Circle';
import { grid } from '../Util/SyncGridData';

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
        for (let x = bounds.minX; x < bounds.maxX; x += grid.dpi) {
            for (let y = bounds.minY; y < bounds.maxY; y += grid.dpi) {
                const square = new AABB(x, y, grid.dpi, grid.dpi);
                const distance = this.roundedCenter.distanceTo(square.center);
                if (distance <= this.roundedDistance) {
                    path.addSquare(square);
                }
            }
        }

        return path.commands;
    }
}
