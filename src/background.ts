import OBR from '@owlbear-rodeo/sdk';
import { getId } from './Util/getId';
import { ConeTool } from './Tools/ConeTool';
import { CircleTool } from './Tools/CircleTool';
import { CubeTool } from './Tools/CubeTool';
import { SettingsForm } from './SettingsForm';
import { StyleForm } from './StyleForm';
import { defaultToolMetadata } from './Util/Metadata';

export function initBackground () {
    OBR.onReady(() => {
        OBR.tool.create({
            id: getId('tool'),
            shortcut: 'A',
            icons: [{
                icon: '/icons/cone.svg',
                label: 'AoE',
            }],
            defaultMode: getId('cone'),
            defaultMetadata: defaultToolMetadata,
        });

        OBR.tool.createMode(new ConeTool());
        OBR.tool.createMode(new CircleTool());
        OBR.tool.createMode(new CubeTool());

        OBR.tool.createAction(new SettingsForm());
        OBR.tool.createAction(new StyleForm());
    });
}
