import { getId } from '../Util/getId';
import { BaseTool } from './BaseTool';
import { PathCommand } from '@owlbear-rodeo/sdk';
import { AABB } from '../Util/Shapes/AABB';
import { Vector } from '../Util/Geometry/Vector';

export class CubeTool extends BaseTool {

    readonly label = 'Cube';
    readonly icon = '/icons/cube.svg';
    readonly id = getId('cube');

    protected getShape (): AABB | null {
        // Turn the distance into a direction.
        let vector: Vector = new Vector({ x: 0, y: 0 });
        if (this.currentPoint.x > this.startPoint.x && this.currentPoint.y > this.startPoint.y) {
            vector = new Vector({ x: this.roundedDistance, y: this.roundedDistance });
        } else if (this.currentPoint.x > this.startPoint.x && this.currentPoint.y < this.startPoint.y) {
            vector = new Vector({ x: this.roundedDistance, y: -this.roundedDistance });
        } else if (this.currentPoint.x < this.startPoint.x && this.currentPoint.y > this.startPoint.y) {
            vector = new Vector({ x: -this.roundedDistance, y: this.roundedDistance });
        } else if (this.currentPoint.x < this.startPoint.x && this.currentPoint.y < this.startPoint.y) {
            vector = new Vector({ x: -this.roundedDistance, y: -this.roundedDistance });
        }

        // Calculate the square.
        return new AABB(this.roundedCenter.x, this.roundedCenter.y, vector.x, vector.y);
    }

    protected buildAreaPathCommand (square: AABB): PathCommand[] {
        return square.pathCommand;
    }
}
