import type {CSSProperties} from 'react';

/** A reveal delay for `[data-reveal]` elements, read by the CSS as `--d`. */
export const delay = (ms: number) => ({'--d': `${ms}ms`}) as CSSProperties;
