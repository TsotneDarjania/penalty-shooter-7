import { ObjectDimensions, ScaleResult } from "./types";

export const calculateScaleToFit = (width: number, height: number, objectDimensions: ObjectDimensions): ScaleResult => {
    const scaleX = width / objectDimensions.width;
    const scaleY = height / objectDimensions.height;

    const scale_x = Math.min(scaleX, scaleY);
    const scale_y = Math.min(scaleX, scaleY);

    return { scaleX: scale_x, scaleY: scale_y };
}

export function calculatePercentage(part: number, total: number): number {
    return Math.floor((part / 100) * total);
}

export function calculatePixels(percentage: number, objectDimensions: ObjectDimensions, axis: 'x' | 'y'): number {
    const dimension = axis === 'x' ? objectDimensions.width : objectDimensions.height;
    const pixels = (percentage / 100) * dimension;
    return pixels;
}  