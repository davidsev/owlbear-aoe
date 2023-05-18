import loadTemplate from '../UI/loadTemplate';
import template from './form.handlebars';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import getId from '../Util/getId';
import 'vanilla-colorful/hex-alpha-color-picker.js';
import './StyleForm.scss';
import findNode from '../UI/findNode';
import { HexAlphaBase } from 'vanilla-colorful/lib/entrypoints/hex-alpha';
import { AoEMetadata, defaultMetadata, getMetadata } from '../Metadata';

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
let metadata: AoEMetadata;

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
        metadata = await getMetadata();

        // Enable the fields.
        setupColorField('areaFill');
        setupColorField('areaStroke');
        setupColorField('shapeFill');
        setupColorField('shapeStroke');
    });

}

function setupColorField (prefix: string) {

    // Find the button to change this color
    const button = findNode(document.body, `div#${prefix}Color`, HTMLDivElement);

    // Get the current and default colours and add it to the button.
    const currentColor = metadata[prefix + 'Color'];
    const currentOpacity = metadata[prefix + 'Opacity'];
    const defaultColor = defaultMetadata[prefix + 'Color'];
    const defaultOpacity = defaultMetadata[prefix + 'Opacity'];
    if (typeof (currentColor) != 'string' || typeof (currentOpacity) != 'number' || typeof (defaultColor) != 'string' || typeof (defaultOpacity) != 'number')
        throw new Error(`Invalid metadata for ${prefix}`);

    // Update the button.
    button.style.backgroundColor = currentColor;
    button.setAttribute('data-color', makeColor(currentColor, currentOpacity));

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

            // Save it
            const toSave: Metadata = {};
            toSave[`${prefix}Color`] = color;
            toSave[`${prefix}Opacity`] = opacity;
            OBR.tool.setMetadata(getId('tool'), toSave);

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
