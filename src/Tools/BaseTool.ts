import OBR, {
    buildLabel,
    buildPath,
    InteractionManager,
    Item,
    Label,
    Path,
    PathCommand,
    ToolContext,
    ToolEvent,
    ToolIcon,
    ToolMode,
} from '@owlbear-rodeo/sdk';
import { getId } from '../Util/getId';
import { Vector } from '../Util/Geometry/Vector';
import { roundTo } from '../Util/roundTo';
import { roomMetadata, RoomMetadata, toolMetadata, ToolMetadata } from '../Util/Metadata';
import { PathBuilder } from '@owlbear-rodeo/sdk/lib/builders/PathBuilder';
import { LabelBuilder } from '@owlbear-rodeo/sdk/lib/builders/LabelBuilder';
import { Shape } from '../Util/Shapes/Shape';
import { grid } from '../Util/SyncGridData';

export abstract class BaseTool implements ToolMode {

    abstract readonly label: string;
    abstract readonly icon: string;
    abstract readonly id: string;
    protected startPoint: Vector = new Vector({ x: 0, y: 0 });
    protected currentPoint: Vector = new Vector({ x: 0, y: 0 });
    private interaction?: InteractionManager<Item[]> = undefined;
    protected toolMetadata: ToolMetadata = toolMetadata.defaultValues;
    protected roomMetadata: RoomMetadata = roomMetadata.defaultValues;

    protected areaItem?: Path;
    protected outlineItem?: Path;
    protected labelItem?: Label;

    /** The icon that will be displayed in the toolbar. */
    get icons (): ToolIcon[] {
        return [{
            icon: this.icon,
            label: this.label,
            filter: {
                activeTools: [getId('tool')],
            },
        }];
    }

    /** Get a Shape representing the "original shape" the user drew (eg the triangle) */
    protected abstract getShape (): Shape | null;

    /** Get a PathCommand for the affected area */
    protected abstract buildAreaPathCommand (shape: Shape): PathCommand[];

    protected get distance (): number {
        return this.currentPoint.distanceTo(this.startPoint);
    }

    protected get roundedDistance (): number {
        return roundTo(this.distance, grid.dpi);
    }

    // When they start drawing, create the shape.
    async onToolDragStart (context: ToolContext, event: ToolEvent) {
        // Save the center and DPI that we are going to use for the whole interaction.
        this.startPoint = new Vector(event.pointerPosition);
        this.currentPoint = new Vector(event.pointerPosition);
        this.toolMetadata = toolMetadata.clean(context.metadata);
        this.roomMetadata = await roomMetadata.get();

        // Make the items.
        this.areaItem = this.buildAreaPath().build();
        const items: Item[] = [this.areaItem];
        if (this.toolMetadata.shapeDisplayMode != 'never') {
            this.outlineItem = this.buildOutlinePath().attachedTo(this.areaItem.id).build();
            items.push(this.outlineItem);
        }
        if (this.toolMetadata.labelDisplayMode != 'never') {
            this.labelItem = this.buildLabel().attachedTo(this.areaItem.id).build();
            items.push(this.labelItem);
        }

        // Start drawing.
        this.interaction = await OBR.interaction.startItemInteraction(items);
    }

    /** Get the items out of the array returned by the interaction update */
    private getItems (items: Item[]): [Path, Path?, Label?] {
        const ret: [Path, Path?, Label?] = [items.shift() as Path, undefined, undefined];
        if (this.toolMetadata.shapeDisplayMode != 'never')
            ret[1] = items.shift() as Path;
        if (this.toolMetadata.labelDisplayMode != 'never')
            ret[2] = items.shift() as Label;

        return ret;
    }

    /** Update the items based on the current mouse position */
    private updateItems (area: Path, outline ?: Path, label?: Label) {
        const shape = this.getShape();

        // If there's no triangle, clear everything (eg if the distance is 0)
        if (!shape) {
            if (outline)
                outline.commands = [];
            area.commands = [];
            if (label)
                label.visible = false;
            return;
        }

        // Update the outline
        if (outline)
            outline.commands = shape.pathCommand;

        // Update the area
        area.commands = this.buildAreaPathCommand(shape);

        // And the text
        if (label) {
            label.text.plainText = `${this.roundedDistance / grid.dpi * (grid.gridScale.parsed.multiplier || 0)}${grid.gridScale.parsed.unit || ''}`;
            label.position = shape.center;
            label.visible = true;
        }
    }

    async onToolDragMove (context: ToolContext, event: ToolEvent) {
        this.toolMetadata = toolMetadata.clean(context.metadata);

        if (this.interaction) {
            const [update] = this.interaction;
            update((items: Item[]) => {
                this.currentPoint = new Vector(event.pointerPosition);
                this.updateItems(...this.getItems(Array.from(items)));
            });
        }
    }

    onToolDragEnd (context: ToolContext, event: ToolEvent) {
        this.toolMetadata = toolMetadata.clean(context.metadata);

        if (this.interaction) {
            // Do a final update of the shape.
            const [update, stop] = this.interaction;
            const items = update((items: Item[]) => {
                this.currentPoint = new Vector(event.pointerPosition);
                this.updateItems(...this.getItems(Array.from(items)));
            });

            // Save the items we want to keep.
            if (this.roundedDistance) {
                const [area, outline, label] = this.getItems(Array.from(items));
                const itemsToKeep: Item[] = [area];
                if (this.toolMetadata.shapeDisplayMode == 'always' && outline)
                    itemsToKeep.push(outline);
                if (this.toolMetadata.labelDisplayMode == 'always' && label)
                    itemsToKeep.push(label);
                OBR.scene.items.addItems(itemsToKeep);
            }

            // Stop the interaction.
            stop();
        }

        // Clean up the references to the shapes we don't need any more.
        this.onToolDragCancel();
    }

    onToolDragCancel () {
        if (this.interaction) {
            const [update, stop] = this.interaction;
            stop();
        }
        this.interaction = undefined;
    }

    protected buildAreaPath (): PathBuilder {
        return buildPath()
            .commands([])
            .metadata({ createdBy: getId() })
            .fillColor(this.toolMetadata.areaFillColor)
            .fillOpacity(this.toolMetadata.areaFillOpacity)
            .strokeWidth(5)
            .strokeColor(this.toolMetadata.areaStrokeColor)
            .strokeOpacity(this.toolMetadata.areaStrokeOpacity);
    }

    protected buildOutlinePath (): PathBuilder {
        return buildPath()
            .commands([])
            .metadata({ createdBy: getId() })
            .fillColor(this.toolMetadata.shapeFillColor)
            .fillOpacity(this.toolMetadata.shapeFillOpacity)
            .strokeWidth(5)
            .strokeColor(this.toolMetadata.shapeStrokeColor)
            .strokeOpacity(this.toolMetadata.shapeStrokeOpacity)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT');
    }

    protected buildLabel (): LabelBuilder {
        return buildLabel()
            .plainText('')
            .metadata({ createdBy: getId() })
            .pointerWidth(0)
            .pointerHeight(0)
            .locked(true)
            .disableHit(true)
            .layer('ATTACHMENT');
    }
}
