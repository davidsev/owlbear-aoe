// Round a number to the nearest multiple of the given chunk size
import { grid } from './SyncGridData';

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

// Round a number to the nearest multiple of the DPI.
export function roundToDpi (value: number): number {
    return Math.round(value / grid.dpi) * grid.dpi;
}

// Round a number to the nearest multiple of the DPI.
export function roundDownToDpi (value: number): number {
    return Math.floor(value / grid.dpi) * grid.dpi;
}

// Round a number to the nearest multiple of the DPI.
export function roundUpToDpi (value: number): number {
    return Math.ceil(value / grid.dpi) * grid.dpi;
}
