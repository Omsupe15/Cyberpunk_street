export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function getZoneWeight(
  t: number,
  start: number,
  peakStart: number,
  peakEnd: number,
  end: number
): number {
  if (t < start || t > end) return 0;
  if (t >= peakStart && t <= peakEnd) return 1;
  if (t < peakStart) return smoothstep(start, peakStart, t);
  return 1 - smoothstep(peakEnd, end, t);
}

