import OBR from '@owlbear-rodeo/sdk';
import getId from './Util/getId';
import Cone from './AoEs/Cone';
import Circle from './AoEs/Circle';
import Cube from './AoEs/Cube';

export default function init () {
    OBR.onReady(() => {
        OBR.tool.create({
            id: getId('tool'),
            shortcut: 'a',
            icons: [
                {
                    icon: '/icons/cone.svg',
                    label: 'D&D AoE',
                },
            ],
        });

        OBR.tool.createMode(new Cone());
        OBR.tool.createMode(new Circle());
        OBR.tool.createMode(new Cube());

    });
}
