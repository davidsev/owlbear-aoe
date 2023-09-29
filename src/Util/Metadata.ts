import { Metadata } from '@owlbear-rodeo/sdk';
import { getId } from './getId';
import { RoomMetadataMapper, ToolMetadataMapper } from '@davidsev/owlbear-utils';

// Merge a metadata object with default values into the correct type.
function cleanMetadata<T extends Metadata> (metadata: Metadata, defaultValues: T): T {
    // If the metadata is missing any keys, fill them in with the defaults.
    for (const key in defaultValues)
        if (metadata[key] === undefined || metadata[key] === null || typeof (metadata[key]) != typeof (defaultValues[key]))
            metadata[key] = defaultValues[key];

    return metadata as T;
}

//
// Room Metadata
//

export enum ConeMode {
    TEMPLATE = 'Template',
    TOKEN = 'Token',
}

export class RoomMetadata {
    coneMode: ConeMode = ConeMode.TEMPLATE;
    coneOverlapThreshold: number = 10;
}

export const roomMetadata = new RoomMetadataMapper(getId(), new RoomMetadata);

//
// Tool Metadata
//

export class ToolMetadata {
    areaFillColor: string = '#000000';
    areaFillOpacity: number = 0.5;
    areaStrokeColor: string = '#000000';
    areaStrokeOpacity: number = 0;
    shapeFillColor: string = '#000000';
    shapeFillOpacity: number = 0;
    shapeStrokeColor: string = '#FF0000';
    shapeStrokeOpacity: number = 1;
    shapeDisplayMode: 'always' | 'drawing' | 'never' = 'always';
    labelDisplayMode: 'always' | 'drawing' | 'never' = 'drawing';

    [key: string]: string | number;
}

export const toolMetadata = new ToolMetadataMapper(getId('tool'), new ToolMetadata);
