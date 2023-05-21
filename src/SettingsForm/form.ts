import loadTemplate from '../UI/loadTemplate';
import template from './form.handlebars';
import findNode from '../UI/findNode';
import OBR, { Item } from '@owlbear-rodeo/sdk';
import getId from '../Util/getId';
import { getRoomMetadata, setRoomMetadata } from '../Metadata';

export function initSettingsForm () {
    // Laad the form.
    const html = loadTemplate(template());
    document.body.replaceChildren(html);

    // Add event listeners.
    const coneOverlapThreshold = findNode(document.body, 'input#coneOverlapThreshold', HTMLInputElement);
    coneOverlapThreshold.addEventListener('change', () => {
        const value = parseInt(coneOverlapThreshold.value, 10);
        setRoomMetadata({ coneOverlapThreshold: value });
    });

    // Delete button
    const deleteButton = findNode(document.body, 'button#deleteAll', HTMLButtonElement);
    deleteButton.addEventListener('click', async () => {
        const itemsToDelete = await OBR.scene.items.getItems((item: Item) => item.metadata?.createdBy === getId());
        const idsToDelete = itemsToDelete.map((item: Item) => item.id);
        await OBR.scene.items.deleteItems(idsToDelete);
    });

    OBR.onReady(() => {
        updateForm();
    });
}

async function updateForm () {
    const metadata = await getRoomMetadata();
    if (!metadata)
        return;

    const coneOverlapThreshold = findNode(document.body, 'input#coneOverlapThreshold', HTMLInputElement);
    coneOverlapThreshold.value = metadata.coneOverlapThreshold?.toString() || '0';
}
