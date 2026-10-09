/**
 * The hero arch's silhouette. The arch box is a rectangle whose top is a
 * semicircle as wide as the box, so its outline is exact arithmetic rather
 * than a sampled grid. Petals that burst out from behind the arch use it to
 * know when they have cleared the frame and may pass in front of it.
 *
 * (u, v) run 0–1 across the arch's box; `aspect` is its height / width.
 */
export function onArch(u: number, v: number, aspect: number) {
  if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
  // Measure in widths so the semicircle stays round at any aspect.
  const y = v * aspect;
  if (y >= 0.5) return true;
  const dx = u - 0.5;
  const dy = y - 0.5;
  return dx * dx + dy * dy <= 0.25;
}
