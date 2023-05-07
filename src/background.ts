import OBR from '@owlbear-rodeo/sdk';
import getId from './Util/getId';
import Cone from './AoEs/Cone';
import Circle from './AoEs/Circle';
import Cube from './AoEs/Cube';
import SettingsForm from './SettingsForm';

export function initBackground () {
    OBR.onReady(() => {
        OBR.tool.create({
            id: getId('tool'),
            shortcut: 'a',
            icons: [
                {
                    icon: '/icons/cone.svg',
                    label: 'AoE',
                },
            ],
            defaultMode: getId('cone'),
            defaultMetadata: {
                coneOverlapThreshold: 0,
            },
        });

        OBR.tool.createMode(new Cone());
        OBR.tool.createMode(new Circle());
        OBR.tool.createMode(new Cube());

        OBR.tool.createAction(new SettingsForm());
    });
}
