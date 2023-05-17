import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { buildLabel, buildPath, buildShape, Item, Label, Path, PathCommand, Shape } from '@owlbear-rodeo/sdk';
import AABB from '../Util/AABB';
import PathSimplifier from '../Util/PathSimplifier';

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
            .position(this.currentPosition.roundToNearest(this.dpi))
            .attachedTo(area.id)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT')
            .build();

        const label: Label = buildLabel()
            .plainText('')
            .position(this.currentPosition)
            .pointerWidth(0)
            .pointerHeight(0)
            .attachedTo(area.id)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT')
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
        label.text.plainText = `${this.roundedDistance / this.dpi * (this.gridScale?.parsed?.multiplier || 0)}${this.gridScale?.parsed?.unit || ''}`;
    }

    protected finalItems (items: Item[]): Item[] {
        if (this.roundedDistance === 0) {
            return [];
        }
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
