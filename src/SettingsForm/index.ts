import OBR, { ToolAction, ToolContext, ToolIcon } from '@owlbear-rodeo/sdk';
import getId from '../Util/getId';

export default class SettingsForm implements ToolAction {

    readonly id = getId('setting');

    readonly icons: ToolIcon[] = [{
        icon: '/icons/settings.svg',
        label: 'Settings',
        filter: {
            activeTools: [getId('tool')],
            roles: ['GM'],
        },
    }];

    onClick (context: ToolContext, elementId: string): void {
        OBR.popover.open({
            id: getId('settings-form'),
            height: 500,
            width: 350,
            url: '/frame.html#settings-form',
            anchorElementId: elementId,
            anchorOrigin: {
                horizontal: 'CENTER',
                vertical: 'BOTTOM',
            },
            transformOrigin: {
                horizontal: 'CENTER',
                vertical: 'TOP',
            },
        });
    }
}
