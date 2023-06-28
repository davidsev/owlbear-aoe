import { getId } from '../Util/getId';
import { AoEShape } from '../AoEShape';
import { Item, Label, Path, PathCommand, Shape } from '@owlbear-rodeo/sdk';
import { AABB } from '../Util/AABB';
import { PathSimplifier } from '../Util/PathSimplifier';

export class Circle extends AoEShape {

    readonly label = 'Circle';
    readonly icon = '/icons/circle.svg';
    readonly id = getId('circle');

    protected createItems (): Item[] {

        const area: Path = this.buildAreaPath()
            .build();

        const outline: Shape = this.buildOutlineShape()
            .shapeType('CIRCLE')
            .position(this.currentPosition.roundToNearest(this.dpi))
            .attachedTo(area.id)
            .build();

        const label: Label = this.buildLabel()
            .attachedTo(area.id)
            .position(this.currentPosition.roundToNearest(this.dpi))
            .build();

        const ret: Item[] = [area];
        if (this.toolMetadata.shapeDisplayMode != 'never')
            ret.push(outline);
        if (this.toolMetadata.labelDisplayMode != 'never')
            ret.push(label);

        return ret;
    }

    private getItems (items: Item[]): [Path, Shape?, Label?] {
        const ret: [Path, Shape?, Label?] = [items.shift() as Path, undefined, undefined];
        if (this.toolMetadata.shapeDisplayMode != 'never')
            ret[1] = items.shift() as Shape;
        if (this.toolMetadata.labelDisplayMode != 'never')
            ret[2] = items.shift() as Label;

        return ret;
    }

    protected updateItems (items: Item[]): void {
        const [area, outline, label] = this.getItems(Array.from(items));

        // Update the outline
        if (outline) {
            outline.width = this.roundedDistance * 2;
            outline.height = this.roundedDistance * 2;
        }

        // Update the area
        area.commands = this.buildAreaPathCommand();

        // And the text
        if (label)
            label.text.plainText = `radius: ${this.roundedDistance / this.dpi * (this.gridScale?.parsed?.multiplier || 0)}${this.gridScale?.parsed?.unit || ''}`;
    }

    protected finalItems (items: Item[]): Item[] {
        if (this.roundedDistance === 0) {
            return [];
        }

        const [area, outline, label] = this.getItems(Array.from(items));

        const ret: Item[] = [area];
        if (this.toolMetadata.shapeDisplayMode == 'always' && outline)
            ret.push(outline);
        if (this.toolMetadata.labelDisplayMode == 'always' && label)
            ret.push(label);

        return ret;
    }

    private buildAreaPathCommand (): PathCommand[] {
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
