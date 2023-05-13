import OBR, {
    GridScale,
    InteractionManager,
    Item,
    Metadata,
    ToolContext,
    ToolEvent,
    ToolIcon,
    ToolMode,
} from '@owlbear-rodeo/sdk';
import getId from './Util/getId';
import Vector from './Util/Vector';
import { roundTo } from './Util/roundTo';

export default abstract class AoEShape implements ToolMode {

    abstract readonly label: string;
    abstract readonly icon: string;
    abstract readonly id: string;
    protected dpi: number = 0;
    protected gridScale: GridScale | null = null;
    protected center: Vector = new Vector({ x: 0, y: 0 });
    protected currentPosition: Vector = new Vector({ x: 0, y: 0 });
    private interaction?: InteractionManager<Item[]> = undefined;
    protected metadata: Metadata = {};

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

    // When they start drawing, create the shape.
    async onToolDragStart (context: ToolContext, event: ToolEvent) {
        // Save the center and DPI that we are going to use for the whole interaction.
        this.dpi = await OBR.scene.grid.getDpi();
        this.gridScale = await OBR.scene.grid.getScale();
        this.center = new Vector(event.pointerPosition);
        this.currentPosition = new Vector(event.pointerPosition);
        this.metadata = context.metadata;

        // Start drawing.
        this.interaction = await OBR.interaction.startItemInteraction(this.createItems(new Vector(event.pointerPosition)));
    }

    async onToolDragMove (context: ToolContext, event: ToolEvent) {
        this.metadata = context.metadata;

        if (this.interaction) {
            const [update] = this.interaction;
            update((items: Item[]) => {
                this.currentPosition = new Vector(event.pointerPosition);
                this.updateItems(items, new Vector(event.pointerPosition));
            });
        }
    }

    onToolDragEnd (context: ToolContext, event: ToolEvent) {
        this.metadata = context.metadata;

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
}
