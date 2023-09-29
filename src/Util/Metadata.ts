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

export interface ToolMetadata extends Metadata {
    areaFillColor: string,
    areaFillOpacity: number,
    areaStrokeColor: string,
    areaStrokeOpacity: number,
    shapeFillColor: string,
    shapeFillOpacity: number,
    shapeStrokeColor: string,
    shapeStrokeOpacity: number,
    shapeDisplayMode: 'always' | 'drawing' | 'never',
    labelDisplayMode: 'always' | 'drawing' | 'never',
}

export const defaultToolMetadata: ToolMetadata = {
    areaFillColor: '#000000',
    areaFillOpacity: 0.5,
    areaStrokeColor: '#000000',
    areaStrokeOpacity: 0,
    shapeFillColor: '#000000',
    shapeFillOpacity: 0,
    shapeStrokeColor: '#FF0000',
    shapeStrokeOpacity: 1,
    shapeDisplayMode: 'always',
    labelDisplayMode: 'drawing',
};

export const toolMetadata = new ToolMetadataMapper(getId('tool'), defaultToolMetadata);
