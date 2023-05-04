import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { buildLabel, buildPath, Item, Label, Path } from '@owlbear-rodeo/sdk';
import Square from '../Util/Square';
import Vector from '../Util/Vector';

export default class Cube extends AoEShape {

    readonly label = 'Cube';
    readonly icon = '/icons/cube.svg';
    readonly id = getId('cube');

    protected createItems (): Item[] {

        const cube: Path = buildPath()
            .strokeColor('red')
            .strokeWidth(5)
            .fillColor('#000000')
            .fillOpacity(0.5)
            .commands([])
            .build();

        const label: Label = buildLabel()
            .plainText('')
            .position(this.currentPosition)
            .pointerWidth(0)
            .pointerHeight(0)
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
        const square = new Square(this.roundedCenter.x, this.roundedCenter.y, vector.x, vector.y);

        // Update the drawn triangle.
        cube.commands = square.pathCommand;

        // And the text.
        label.text.plainText = `${this.roundedDistance / this.dpi * 5}ft`;
        label.position = square.center;
    }

    protected finalItems (items: Item[]): Item[] {
        const [cube, label] = items as [Path, Label];
        return [cube];
    }
}
