import OBR, {
    buildLabel,
    buildPath,
    buildShape,
    GridScale,
    InteractionManager,
    Item,
    ToolContext,
    ToolEvent,
    ToolIcon,
    ToolMode,
} from '@owlbear-rodeo/sdk';
import { getId } from './Util/getId';
import { Vector } from './Util/Vector';
import { roundTo } from './Util/roundTo';
import {
    cleanToolMetadata,
    defaultRoomMetadata,
    defaultToolMetadata,
    getRoomMetadata,
    RoomMetadata,
    ToolMetadata,
} from './Metadata';
import { PathBuilder } from '@owlbear-rodeo/sdk/lib/builders/PathBuilder';
import { LabelBuilder } from '@owlbear-rodeo/sdk/lib/builders/LabelBuilder';
import { ShapeBuilder } from '@owlbear-rodeo/sdk/lib/builders/ShapeBuilder';

export abstract class AoEShape implements ToolMode {

    abstract readonly label: string;
    abstract readonly icon: string;
    abstract readonly id: string;
    protected dpi: number = 0;
    protected gridScale: GridScale | null = null;
    protected center: Vector = new Vector({ x: 0, y: 0 });
    protected currentPosition: Vector = new Vector({ x: 0, y: 0 });
    private interaction?: InteractionManager<Item[]> = undefined;
    protected toolMetadata: ToolMetadata = defaultToolMetadata;
    protected roomMetadata: RoomMetadata = defaultRoomMetadata;

    constructor () {
    }

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

    protected abstract createItems (position: Vector): Item[];

    protected abstract updateItems (items: Item[], position: Vector): void;

    protected abstract finalItems (items: Item[], position: Vector): Item[];

    protected get roundedCenter (): Vector {
        return this.center.roundToNearest(this.dpi);
    }

    protected get distance (): number {
        return this.currentPosition.distanceTo(this.center);
    }

    protected get roundedDistance (): number {
        return roundTo(this.distance, this.dpi);
    }

    protected get roundedDistanceInSquares (): number {
        return this.roundedDistance / this.dpi;
    }

    // When they start drawing, create the shape.
    async onToolDragStart (context: ToolContext, event: ToolEvent) {
        // Save the center and DPI that we are going to use for the whole interaction.
        this.dpi = await OBR.scene.grid.getDpi();
        this.gridScale = await OBR.scene.grid.getScale();
        this.center = new Vector(event.pointerPosition);
        this.currentPosition = new Vector(event.pointerPosition);
        this.toolMetadata = cleanToolMetadata(context.metadata);
        this.roomMetadata = await getRoomMetadata();

        // Start drawing.
        this.interaction = await OBR.interaction.startItemInteraction(this.createItems(new Vector(event.pointerPosition)));
    }

    async onToolDragMove (context: ToolContext, event: ToolEvent) {
        this.toolMetadata = cleanToolMetadata(context.metadata);

        if (this.interaction) {
            const [update] = this.interaction;
            update((items: Item[]) => {
                this.currentPosition = new Vector(event.pointerPosition);
                this.updateItems(items, new Vector(event.pointerPosition));
            });
        }
    }

    onToolDragEnd (context: ToolContext, event: ToolEvent) {
        this.toolMetadata = cleanToolMetadata(context.metadata);

        if (this.interaction) {
            const [update, stop] = this.interaction;
            const items = update((items: Item[]) => {
                this.updateItems(items, new Vector(event.pointerPosition));
            });
            // Properly add the items.
            OBR.scene.items.addItems(this.finalItems(items, new Vector(event.pointerPosition)));
            // Stop the interaction.
            stop();
        }
        this.interaction = undefined;
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

    protected buildOutlineShape (): ShapeBuilder {
        return buildShape()
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
