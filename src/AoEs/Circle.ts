import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { buildLabel, buildPath, buildShape, Command, Item, Label, Path, PathCommand, Shape } from '@owlbear-rodeo/sdk';
import AABB from '../Util/AABB';

export default class Circle extends AoEShape {

    readonly label = 'Circle';
    readonly icon = '/icons/circle.svg';
    readonly id = getId('circle');

    protected createItems (): Item[] {

        const area: Path = buildPath()
            .strokeWidth(0)
            .fillColor('#000000')
            .fillOpacity(0.5)
            .commands([])
            .build();

        const outline: Shape = buildShape()
            .shapeType('CIRCLE')
            .strokeColor('red')
            .strokeWidth(5)
            .fillOpacity(0)
            .attachedTo(area.id)
            .position(this.currentPosition.roundToNearest(this.dpi))
            .build();

        const label: Label = buildLabel()
            .plainText('')
            .position(this.currentPosition)
            .pointerWidth(0)
            .pointerHeight(0)
            .attachedTo(area.id)
            .build();

        return [area, outline, label];
    }

    protected updateItems (items: Item[]): void {
        const [area, outline, label] = items as [Path, Shape, Label];

        // Update the outline
        outline.width = this.roundedDistance * 2;
        outline.height = this.roundedDistance * 2;

        // Update the area
        area.commands = this.buildAreaPath();

        // And the text
        label.text.plainText = `${this.roundedDistance / this.dpi * 5}ft`;
    }

    protected finalItems (items: Item[]): Item[] {
        const [area, outline, label] = items as [Path, Shape, Label];

        return [area, outline];
    }

    private buildAreaPath (): PathCommand[] {
        // Work out the bounding square for our search area.
        const bounds = new AABB(
            this.roundedCenter.x - this.roundedDistance,
            this.roundedCenter.y - this.roundedDistance,
            this.roundedDistance * 2,
            this.roundedDistance * 2,
        );

        // Check every square.
        const commands: PathCommand[] = [];
        for (let x = bounds.minX; x <= bounds.maxX; x += this.dpi) {
            for (let y = bounds.minY; y <= bounds.maxY; y += this.dpi) {
                // See if the center of this square is inside the circle.
                const square = new AABB(x, y, this.dpi, this.dpi);
                const distance = this.roundedCenter.distanceTo(square.center);
                if (distance <= this.roundedDistance) {
                    commands.push([Command.MOVE, x, y]);
                    commands.push([Command.LINE, x + this.dpi, y]);
                    commands.push([Command.LINE, x + this.dpi, y + this.dpi]);
                    commands.push([Command.LINE, x, y + this.dpi]);
                    commands.push([Command.CLOSE]);
                }
            }
        }

        return commands;
    }
}
