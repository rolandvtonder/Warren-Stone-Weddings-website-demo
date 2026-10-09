export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where `v` sits between `a` and `b`, clamped to 0–1. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInQuad = (t: number) => t * t;

/**
 * Scroll progress through a tall section whose child is `position: sticky`.
 * 0 when the section's top meets the viewport top, 1 when the sticky child
 * is about to unpin.
 */
export function pinProgress(el: HTMLElement): {p: number; rect: DOMRect; vh: number} {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const span = Math.max(1, rect.height - vh);
  return {p: clamp(-rect.top / span), rect, vh};
}

/**
 * Progress of an ordinary (unpinned) element across the viewport: 0 when its
 * top enters at the bottom of the screen, 1 when its bottom leaves at the top.
 */
export function passProgress(el: HTMLElement): {p: number; rect: DOMRect; vh: number} {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return {p: clamp((vh - rect.top) / (vh + rect.height)), rect, vh};
}
