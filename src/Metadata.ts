import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import getId from './Util/getId';

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

export interface RoomMetadata extends Metadata {
    coneOverlapThreshold: number,
}

export const defaultRoomMetadata: RoomMetadata = {
    coneOverlapThreshold: 10,
};

export async function getRoomMetadata (): Promise<RoomMetadata> {
    const metadata = await OBR.room.getMetadata() || {};
    const myMetadata = (metadata[getId()] || {}) as Metadata;
    return cleanRoomMetadata(myMetadata);
}

export async function setRoomMetadata (metadata: Partial<RoomMetadata>): Promise<void> {
    const set: Metadata = {};
    set[getId()] = metadata;
    return OBR.room.setMetadata(set);
}

export function cleanRoomMetadata (metadata: Metadata): RoomMetadata {
    return cleanMetadata(metadata, defaultRoomMetadata);
}

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

export async function getToolMetadata (): Promise<ToolMetadata> {
    const metadata = await OBR.tool.getMetadata(getId('tool')) || {};
    return cleanToolMetadata(metadata);
}

export async function setToolMetadata (metadata: Partial<RoomMetadata>): Promise<void> {
    return OBR.tool.setMetadata(getId('tool'), metadata);
}

export function cleanToolMetadata (metadata: Metadata): ToolMetadata {
    return cleanMetadata(metadata, defaultToolMetadata);
}
