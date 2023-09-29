import OBR from '@owlbear-rodeo/sdk';
import { getId } from './Util/getId';
import { ConeTool } from './Tools/ConeTool';
import { CircleTool } from './Tools/CircleTool';
import { CubeTool } from './Tools/CubeTool';
import { SettingsForm } from './SettingsForm';
import { StyleForm } from './StyleForm';
import { toolMetadata } from './Util/Metadata';
import { grid } from './Util/SyncGridData';

export function initBackground () {
    OBR.onReady(async () => {

        await grid.init();

        OBR.tool.create({
            id: getId('tool'),
            shortcut: 'A',
            icons: [{
                icon: '/icons/cone.svg',
                label: 'AoE',
            }],
            defaultMode: getId('cone'),
            defaultMetadata: toolMetadata.defaultValues,
        });

        OBR.tool.createMode(new ConeTool());
        OBR.tool.createMode(new CircleTool());
        OBR.tool.createMode(new CubeTool());

        OBR.tool.createAction(new SettingsForm());
        OBR.tool.createAction(new StyleForm());
    });
}
