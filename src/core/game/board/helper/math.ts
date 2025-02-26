export function getRandomIntInRange(from: number, to: number): number {
  if (from > to) {
    throw new Error(
      "Invalid range: 'from' should be less than or equal to 'to'."
    );
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function calculatePercentage(part: number, total: number): number {
  return Math.floor((part / 100) * total);
}
