import loadTemplate from '../UI/loadTemplate';
import template from './form.handlebars';
import findNode from '../UI/findNode';
import OBR from '@owlbear-rodeo/sdk';
import getId from '../Util/getId';

export function initSettingsForm () {
    // Laad the form.
    const html = loadTemplate(template());
    document.body.replaceChildren(html);

    // Add event listeners.
    const coneOverlapThreshold = findNode(document.body, 'input#coneOverlapThreshold', HTMLInputElement);
    coneOverlapThreshold.addEventListener('change', () => {
        const value = parseInt(coneOverlapThreshold.value, 10);
        OBR.tool.setMetadata(getId('tool'), { coneOverlapThreshold: value });
    });

    OBR.onReady(() => {
        updateForm();
    });
}

async function updateForm () {
    const metadata = await OBR.tool.getMetadata(getId('tool'));
    if (!metadata)
        return;

    const coneOverlapThreshold = findNode(document.body, 'input#coneOverlapThreshold', HTMLInputElement);
    coneOverlapThreshold.value = metadata.coneOverlapThreshold?.toString() || '0';
}
