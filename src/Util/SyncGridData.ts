import OBR, { Grid, GridMeasurement, GridScale, GridStyle, GridType } from '@owlbear-rodeo/sdk';

/** Getting data from the API is mostly async, which is a PITA inside utility functions etc.
 * eg Vector needs the DPI to snap to grid.
 * Getting it once and passing it down the chain is a bit of a pain too.
 * This class keeps track of it and allows synchronous access to it all.
 */
export const grid = new class SyncGridData implements Grid {
    private gridData?: Grid;
    private scaleData?: GridScale;

    /** Sets up the event listener, and resolves once the first data is loaded. */
    public init () {
        return new Promise<void>((resolve?: (value: (PromiseLike<void> | void)) => void) => {
            // Watch for grid changes.
            OBR.scene.grid.onChange(async (gridData) => {
                // Copy in the data.
                this.gridData = gridData;
                // Also get the proper scale data.
                this.scaleData = (await OBR.scene.grid.getScale());
                // If this is the first call then resolve the promise.
                if (resolve) {
                    resolve();
                    resolve = undefined;
                }
            });
        });
    }

    get dpi (): number {
        if (!this.gridData)
            throw new Error('Grid data not loaded yet');
        return this.gridData.dpi;
    }

    get style (): GridStyle {
        if (!this.gridData)
            throw new Error('Grid data not loaded yet');
        return this.gridData.style;
    }

    get type (): GridType {
        if (!this.gridData)
            throw new Error('Grid data not loaded yet');
        return this.gridData.type;
    }

    get measurement (): GridMeasurement {
        if (!this.gridData)
            throw new Error('Grid data not loaded yet');
        return this.gridData.measurement;
    }

    get scale (): string {
        if (!this.gridData)
            throw new Error('Grid data not loaded yet');
        return this.gridData.scale;
    }

    get gridScale (): GridScale {
        if (!this.scaleData)
            throw new Error('Grid data not loaded yet');
        return this.scaleData;
    }
};
