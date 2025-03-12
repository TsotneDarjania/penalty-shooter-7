/**
 * Adjust the SVG path by applying offsets and scaling
 * @param path - The raw SVG path as a string
 * @param offsetX - Offset to add to the X coordinates
 * @param offsetY - Offset to add to the Y coordinates
 * @param scale - Scaling factor to apply to the coordinates
 * @returns The adjusted path as a string
 */
export function adjustSVGPath(
  path: string,
  offsetX: number,
  offsetY: number,
  scale: number = 1
): string {
  return path.replace(/([ML])\s*([\d\s.,-]+)/g, (_match, command, coords) => {
    const adjustedCoords = coords
      .trim()
      .split(/[\s,]+/)
      .map((coord: string, index: number) => {
        const originalValue = parseFloat(coord);
        // Apply scaling and offsets
        const adjustedValue =
          index % 2 === 0 // Even index for X, odd for Y
            ? offsetX + scale * originalValue // Adjust X
            : offsetY + scale * originalValue; // Adjust Y
        return adjustedValue.toFixed(2); // Limit decimals for precision
      })
      .join(" ");
    return `${command} ${adjustedCoords}`;
  });
}

export const createKey = (arr: [number, number]): string => arr.join(",");

export function calculatePercentage(part: number, total: number): number {
  return Math.floor((part / 100) * total);
}

export function getPercentageOfNumber(number: number, percentage: number) {
  return number * (percentage / 100);
}

export function getRandomIntInRange(from: number, to: number): number {
  if (from > to) {
    throw new Error(
      "Invalid range: 'from' should be less than or equal to 'to'."
    );
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function findClosestPoint(
  points: { x: number; y: number }[],
  target: { x: number; y: number }
): { x: number; y: number } {
  let closestPoint = points[0]; // Initialize with the first point
  let minDistance = Number.MAX_VALUE; // Start with the maximum possible value

  points.forEach((point) => {
    // Calculate Euclidean distance
    const distance = Math.sqrt(
      Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2)
    );

    // Update the closest point if this point is closer
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
}

export function areArraysEqual(arr1: number[], arr2: number[]) {
  // Check if the lengths are the same
  if (arr1.length !== arr2.length) return false;

  // Compare each element
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

export function getRandomFloat(min: number, max: number): number {
  if (min >= max) {
    throw new Error("The 'min' value must be less than the 'max' value.");
  }
  return Math.random() * (max - min) + min;
}
