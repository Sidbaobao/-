export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}
