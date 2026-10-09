import {StrictMode, useEffect, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {Footer, Header} from './components/Chrome';
import {useReducedMotion} from './hooks/useReducedMotion';
import {useReveals} from './hooks/useReveals';
import {trackPointer} from './lib/pointer';
import {startScroll} from './lib/scroll';
import './index.css';

/**
 * Every page is its own HTML entry; each one mounts through here so they
 * all share the header, footer, grain, the single scroll loop and the
 * pointer tilt.
 */
function Frame({children}: {children: ReactNode}) {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);
  useEffect(() => trackPointer(), []);
  const ref = useReveals<HTMLDivElement>();

  return (
    <div ref={ref}>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}

export function mount(page: ReactNode) {
  // The pinned stages depend on scroll position; always start at the top
  // (unless the address points at an anchor further down).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Frame>{page}</Frame>
    </StrictMode>,
  );
}
