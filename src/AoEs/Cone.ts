import getId from '../Util/getId';
import AoEShape from '../AoEShape';
import { buildLabel, buildPath, Command, Item, Label, Path, PathCommand } from '@owlbear-rodeo/sdk';
import Triangle from '../Util/Triangle';
import Square from '../Util/Square';
import Vector from '../Util/Vector';

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
            .build();

        const label: Label = buildLabel()
            .plainText('')
            .pointerWidth(0)
            .pointerHeight(0)
            .strokeColor('#FFFFFF')
            .position(this.currentPosition)
            .attachedTo(area.id)
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
        area.commands = this.buildAreaPath(triangle);

        // And the text
        label.text.plainText = `${this.roundedDistance / this.dpi * 5}ft`;
        label.position = triangle.center;
    }

    protected finalItems (items: Item[], position: Vector): Item[] {
        const [area, outline, label] = items as [Path, Path, Label];

        const labels: Label[] = [];
        // const triangle = this.getTriangle();
        // const bounds = triangle.getBounds(this.dpi);
        // for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
        //     for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
        //         const square = new Square(x, y, this.dpi, this.dpi);
        //         const overlap = triangle.intersectsSquareAmount(square);
        //         labels.push(buildLabel()
        //             .plainText(overlap.toString())
        //             .pointerWidth(0)
        //             .pointerHeight(0)
        //             .strokeColor('#FFFFFF')
        //             .position({x: x + this.dpi / 2, y: y + this.dpi / 2})
        //             .attachedTo(area.id)
        //             .fontSize(10)
        //             .build());
        //     }
        // }

        return [area, outline, ...labels];
    }

    private buildAreaPath (triangle: Triangle): PathCommand[] {
        // Work out the bounding square for our search area.
        const bounds = triangle.getBounds(this.dpi);

        // Check every square.
        const commands: PathCommand[] = [];
        for (let x = bounds.minX; x < bounds.maxX; x += this.dpi) {
            for (let y = bounds.minY; y < bounds.maxY; y += this.dpi) {
                const square = new Square(x, y, this.dpi, this.dpi);
                if (triangle.intersectsSquareAmount(square) > 33) {
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
