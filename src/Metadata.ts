import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import getId from './Util/getId';

export interface AoEMetadata extends Metadata {
    coneOverlapThreshold: number,
    areaFillColor: string,
    areaFillOpacity: number,
    areaStrokeColor: string,
    areaStrokeOpacity: number,
    shapeFillColor: string,
    shapeFillOpacity: number,
    shapeStrokeColor: string,
    shapeStrokeOpacity: number,
}

export const defaultMetadata: AoEMetadata = {
    coneOverlapThreshold: 10,
    areaFillColor: '#000000',
    areaFillOpacity: 0.5,
    areaStrokeColor: '#000000',
    areaStrokeOpacity: 0,
    shapeFillColor: '#000000',
    shapeFillOpacity: 0,
    shapeStrokeColor: '#FF0000',
    shapeStrokeOpacity: 1,
};

export async function getMetadata (): Promise<AoEMetadata> {
    const metadata = await OBR.tool.getMetadata(getId('tool')) || {};
    return cleanMetadata(metadata);
}

export function cleanMetadata (metadata: Metadata): AoEMetadata {
    // If the metadata is missing any keys, fill them in with the defaults.
    for (const key in defaultMetadata)
        if (metadata[key] === undefined || metadata[key] === null || typeof (metadata[key]) != typeof (defaultMetadata[key]))
            metadata[key] = defaultMetadata[key];

    return metadata as AoEMetadata;
}
