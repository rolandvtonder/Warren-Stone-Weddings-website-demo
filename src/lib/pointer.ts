import {onFrame} from './scroll';

/**
 * The pointer as a smoothed −1…1 pair, centred on the viewport. Layers read
 * it every frame and shift by their depth, so the whole scene tilts a
 * little under the cursor like a diorama. Touch devices stay at rest.
 */
export const pointer = {x: 0, y: 0};

let started = false;

export function trackPointer() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let tx = 0;
  let ty = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    },
    {passive: true},
  );
  onFrame(() => {
    pointer.x += (tx - pointer.x) * 0.06;
    pointer.y += (ty - pointer.y) * 0.06;
  });
}
