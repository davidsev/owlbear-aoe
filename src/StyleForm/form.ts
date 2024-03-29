import { loadTemplate } from '../Util/UI/loadTemplate';
import template from './form.handlebars';
import OBR from '@owlbear-rodeo/sdk';
import 'vanilla-colorful/hex-alpha-color-picker.js';
import './StyleForm.scss';
import { findNode } from '../Util/UI/findNode';
import { HexAlphaBase } from 'vanilla-colorful/lib/entrypoints/hex-alpha';
import { toolMetadata, ToolMetadata } from '../Util/Metadata';
import { getId } from '../Util/getId';

function makeColor (color: string, opacity: number) {
    return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
}

function splitColor (color: string): [string, number] {
    const opacity = parseInt(color.slice(7), 16) / 255;
    return [color.slice(0, 7), Number.isFinite(opacity) ? opacity : 1];
}

let popup: {
    div: HTMLDivElement;
    picker: HexAlphaBase;
    saveButton: HTMLButtonElement;
    defaultButton: HTMLButtonElement;
};
let metadata: ToolMetadata = toolMetadata.defaultValues;

export async function initStyleForm () {
    // Load the form.
    const html = loadTemplate(template());
    document.body.replaceChildren(html);

    OBR.onReady(async () => {
        // Get the popup elements.
        popup = {
            div: findNode(document.body, 'div#Popup', HTMLDivElement),
            picker: findNode(document.body, 'hex-alpha-color-picker#ColorPicker', HexAlphaBase),
            saveButton: findNode(document.body, 'button#SaveButton', HTMLButtonElement),
            defaultButton: findNode(document.body, 'button#DefaultButton', HTMLButtonElement),
        };
        await OBR.tool.getMetadata(getId('tool'));
        metadata = await toolMetadata.get();

        // Enable the fields.
        setupColorField('areaFill');
        setupColorField('areaStroke');
        setupColorField('shapeFill');
        setupColorField('shapeStroke');
        setupSelect('shapeDisplayMode');
        setupSelect('labelDisplayMode');
    });

    // Reset button
    const resetButton = findNode(document.body, 'button#resetStyles', HTMLButtonElement);
    resetButton.addEventListener('click', async () => {
        await toolMetadata.set(toolMetadata.defaultValues);
        location.reload();
    });
}

function setupColorField (prefix: string) {

    // Find the button to change this color
    const button = findNode(document.body, `div#${prefix}Color`, HTMLDivElement);

    // Get the current and default colours and add it to the button.
    const currentColor = metadata[prefix + 'Color'];
    const currentOpacity = metadata[prefix + 'Opacity'];
    const defaultColor = toolMetadata.defaultValues[prefix + 'Color'];
    const defaultOpacity = toolMetadata.defaultValues[prefix + 'Opacity'];
    if (typeof (currentColor) != 'string' || typeof (currentOpacity) != 'number' || typeof (defaultColor) != 'string' || typeof (defaultOpacity) != 'number')
        throw new Error(`Invalid metadata for ${prefix}`);

    // Update the button.
    button.style.backgroundColor = currentColor;
    button.setAttribute('data-color', makeColor(currentColor, currentOpacity));
    button.innerText = `${(currentOpacity * 100).toFixed(0)}%`;

    // Show the popup when it's clicked.
    button.addEventListener('click', () => {

        // Show the form, and set it's colour.
        popup.div.style.display = 'block';
        popup.picker.color = button.getAttribute('data-color') || '#00000000';

        // Make the save button work.
        const abortController = new AbortController();
        popup.saveButton.addEventListener('click', () => {
            // Get the colour
            const [color, opacity] = splitColor(popup.picker.color);

            // Update the button
            button.style.backgroundColor = color;
            button.setAttribute('data-color', popup.picker.color);
            button.innerText = `${(opacity * 100).toFixed(0)}%`;

            // Save it
            toolMetadata.set({
                [`${prefix}Color`]: color,
                [`${prefix}Opacity`]: opacity,
            });

            // Close
            popup.div.style.display = 'none';
            abortController.abort();
        }, { signal: abortController.signal });

        // Make the default button work.
        popup.defaultButton.addEventListener('click', () => {
            popup.picker.color = makeColor(defaultColor, defaultOpacity);
        }, { signal: abortController.signal });
    });
}

function setupSelect (name: string) {
    const select = findNode(document.body, `select#${name}`, HTMLSelectElement);

    // Set the current value.
    const currentValue = metadata[name];
    if (typeof (currentValue) != 'string')
        throw new Error(`Invalid metadata for ${name}`);

    select.value = currentValue;

    // Save the value when it changes.
    select.addEventListener('change', () => {
        toolMetadata.set({ [name]: select.value });
    });
}
