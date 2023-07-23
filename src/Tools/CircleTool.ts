import { getId } from '../Util/getId';
import { BaseTool } from './BaseTool';
import { PathCommand } from '@owlbear-rodeo/sdk';
import { AABB, Circle } from '../Util/Shapes';
import { PathSimplifier } from '../Util/Geometry/PathSimplifier';
import { grid } from '../Util/SyncGridData';

export class CircleTool extends BaseTool {

    readonly label = 'Circle';
    readonly icon = '/icons/circle.svg';
    readonly id = getId('circle');

    protected getShape (): Circle | null {
        if (!this.roundedDistance)
            return null;
        return new Circle(this.startPoint.nearestGridCorner, this.roundedDistance);
    }

    protected buildAreaPathCommand (): PathCommand[] {
        // Work out the bounding square for our search area.
        const bounds = new AABB(
            this.startPoint.nearestGridCorner.x - this.roundedDistance,
            this.startPoint.nearestGridCorner.y - this.roundedDistance,
            this.roundedDistance * 2,
            this.roundedDistance * 2,
        );

        // Check every square.
        const path = new PathSimplifier();
        for (const square of bounds.iterateGrid(grid.dpi)) {
            if (this.startPoint.nearestGridCorner.distanceTo(square.center) <= this.roundedDistance) {
                path.addSquare(square);
            }
        }

        return path.commands;
    }
}
