import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { Item, Label, Path } from '@owlbear-rodeo/sdk';
import AABB from '../Util/AABB';
import Vector from '../Util/Vector';

export default class Cube extends AoEShape {

    readonly label = 'Cube';
    readonly icon = '/icons/cube.svg';
    readonly id = getId('cube');

    protected createItems (): Item[] {

        const cube: Path = this.buildAreaPath()
            // Use the area stuff, but use the outline color.
            .strokeColor(this.metadata.shapeStrokeColor)
            .strokeOpacity(this.metadata.shapeStrokeOpacity)
            .build();

        const label: Label = this.buildLabel()
            .attachedTo(cube.id)
            .build();

        return [cube, label];
    }

    protected updateItems (items: Item[]): void {
        const [cube, label] = items as [Path, Label];

        // Turn the distance into a direction.
        let vector: Vector = new Vector({ x: 0, y: 0 });
        if (this.currentPosition.x > this.center.x && this.currentPosition.y > this.center.y) {
            vector = new Vector({ x: this.roundedDistance, y: this.roundedDistance });
        } else if (this.currentPosition.x > this.center.x && this.currentPosition.y < this.center.y) {
            vector = new Vector({ x: this.roundedDistance, y: -this.roundedDistance });
        } else if (this.currentPosition.x < this.center.x && this.currentPosition.y > this.center.y) {
            vector = new Vector({ x: -this.roundedDistance, y: this.roundedDistance });
        } else if (this.currentPosition.x < this.center.x && this.currentPosition.y < this.center.y) {
            vector = new Vector({ x: -this.roundedDistance, y: -this.roundedDistance });
        }

        // Calculate the square.
        const square = new AABB(this.roundedCenter.x, this.roundedCenter.y, vector.x, vector.y);

        // Update the drawn triangle.
        cube.commands = square.pathCommand;

        // And the text.
        label.text.plainText = `${this.roundedDistance / this.dpi * (this.gridScale?.parsed?.multiplier || 0)}${this.gridScale?.parsed?.unit || ''}`;
        label.position = square.center;
    }

    protected finalItems (items: Item[]): Item[] {
        if (this.roundedDistance === 0) {
            return [];
        }

        const [cube, label] = items as [Path, Label];
        return [cube];
    }
}
