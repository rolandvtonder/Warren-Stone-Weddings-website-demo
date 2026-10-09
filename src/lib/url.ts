/**
 * Site-relative URLs. The site may be served from a sub-folder (GitHub
 * Pages serves it under /<repo-name>/), so every path to a page, photo or
 * petal goes through `u`, which swaps the leading slash for Vite's base.
 * It also handles srcset strings: every URL in the list is prefixed.
 */
const BASE = import.meta.env.BASE_URL;

export const u = (path: string) => path.replace(/(^|,\s*)\//g, `$1${BASE}`);
