import { Vector2 } from '@owlbear-rodeo/sdk';

function instanceOfVector2 (object: any): object is Vector2 {
    return 'x' in object && 'y' in object;
}

// Round a number to the nearest multiple of the given chunk size
export function roundTo (value: number, chunk: number): number {
    return Math.round(value / chunk) * chunk;
}

// Round a number to the nearest multiple of the given chunk size, always rounding down.
export function roundDownTo (value: number, chunk: number): number {
    return Math.floor(value / chunk) * chunk;
}

// Round a number to the nearest multiple of the given chunk size, always rounding up.
export function roundUpTo (value: number, chunk: number): number {
    return Math.ceil(value / chunk) * chunk;
}