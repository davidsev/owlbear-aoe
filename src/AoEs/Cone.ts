import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { buildLabel, buildPath, Item, Label, Path } from '@owlbear-rodeo/sdk';
import Triangle from '../Util/Triangle';
import AABB from '../Util/AABB';
import Vector from '../Util/Vector';
import PathSimplifier from '../Util/PathSimplifier';

export default class Cone extends AoEShape {

    readonly label = 'Cone';
    readonly icon = '/icons/cone.svg';
    readonly id = getId('cone');

    protected createItems (): Item[] {

        const area: Path = buildPath()
            .strokeWidth(0)
            .fillColor('#000000')
            .fillOpacity(0.5)
            .commands([])
            .build();

        const outline: Path = buildPath()
            .strokeColor('red')
            .strokeWidth(5)
            .fillOpacity(0)
            .commands([])
            .attachedTo(area.id)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT')
            .build();

        const label: Label = buildLabel()
            .plainText('')
            .pointerWidth(0)
            .pointerHeight(0)
            .strokeColor('#FFFFFF')
            .position(this.currentPosition)
            .attachedTo(area.id)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT')
            .build();

        return [area, outline, label];
    }

    private getTriangle (): Triangle {
        const angle = this.currentPosition.angleTo(this.roundedCenter);
        return Triangle.fromDirectionAndSize(this.roundedCenter, angle, this.roundedDistance);
    }

    protected updateItems (items: Item[], position: Vector): void {
        const [area, outline, label] = items as [Path, Path, Label];

        const triangle = this.getTriangle();

        // Update the outline
        outline.commands = triangle.pathCommand;

        // Update the area
        area.commands = this.buildAreaPath(triangle).commands;

        // And the text
        label.text.plainText = `${this.roundedDistance / this.dpi * (this.gridScale?.parsed?.multiplier || 0)}${this.gridScale?.parsed?.unit || ''}`;
        label.position = triangle.center;
    }

    protected finalItems (items: Item[], position: Vector): Item[] {
        const [area, outline, label] = items as [Path, Path, Label];

        const labels: Label[] = [];
        // const triangle = this.getTriangle();
        // const bounds = triangle.getBounds(this.dpi);
        // for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
        //     for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
        //         const square = new AABB(x, y, this.dpi, this.dpi);
        //         const overlap = triangle.intersectsSquareAmount(square);
        //         labels.push(buildLabel()
        //             .plainText(overlap.toString())
        //             .pointerWidth(0)
        //             .pointerHeight(0)
        //             .strokeColor('#FFFFFF')
        //             .position({ x: x + this.dpi / 2, y: y + this.dpi / 2 })
        //             .attachedTo(area.id)
        //             .fontSize(10)
        //             .build());
        //     }
        // }

        // let i = 1;
        // const points = this.buildAreaPath((this.getTriangle())).simplify();
        // for (const point of points) {
        //     labels.push(buildLabel()
        //         .plainText(`${i++}: ${point}`)
        //         .pointerWidth(0)
        //         .pointerHeight(0)
        //         .strokeColor('#FFFFFF')
        //         .position(point)
        //         .attachedTo(area.id)
        //         .fontSize(10)
        //         .build());
        // }

        return [area, outline, ...labels];
    }

    private buildAreaPath (triangle: Triangle): PathSimplifier {
        // Work out the bounding square for our search area.
        const bounds = triangle.getBounds(this.dpi);

        // Check every square.
        const path = new PathSimplifier();
        for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
            for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
                const square = new AABB(x, y, this.dpi, this.dpi);
                let threshold = this.metadata.coneOverlapThreshold;
                if (!Number.isFinite(threshold))
                    threshold = 0;
                if (triangle.intersectsSquareAmount(square) > (threshold as number)) {
                    path.addSquare(square);
                }
            }
        }

        return path;
    }
}
