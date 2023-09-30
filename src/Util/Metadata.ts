import { getId } from './getId';
import { RoomMetadataMapper, ToolMetadataMapper } from '@davidsev/owlbear-utils';

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
