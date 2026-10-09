import {useEffect, useRef} from 'react';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * A band of huge outlined lettering between sections. It drifts on its own,
 * surges with the scroll — faster the harder you scroll, backwards when you
 * scroll up — and leans into the motion (a skew that springs back), like
 * type on a panning camera. `quiet` is the smaller, solid-serif variant
 * used for lists of names.
 */
export function Marquee({text, quiet = false, reverse = false}: {text: string; quiet?: boolean; reverse?: boolean}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    let x = 0;
    let lastY = window.scrollY;
    let lastTime = 0;
    let v = 0;
    let dir = reverse ? 1 : -1;
    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy) dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1);
      v += (dy / Math.max(dt, 0.001) - v) * 0.1;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track || reducedRef.current) return;
      const r = wrap.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      x += dir * (40 + Math.min(Math.abs(v), 3000) * 0.4) * dt;
      const half = track.scrollWidth / 2;
      if (half > 0) x = ((x % half) - half) % half;
      const skew = clamp(-v / 250, -12, 12) * (quiet ? 0.4 : 1);
      track.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
    });
  }, [quiet, reverse]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`relative overflow-hidden bg-ink ${quiet ? 'py-5' : 'border-y border-ivory/10 py-8 md:py-12'}`}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((k) =>
          quiet ? (
            <span key={k} className="accent pr-[0.6em] text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none whitespace-nowrap text-linen/80">
              {text}
            </span>
          ) : (
            <span
              key={k}
              className="caps pr-[0.3em] text-[clamp(4.5rem,14vw,14rem)] leading-none whitespace-nowrap text-transparent"
              style={{WebkitTextStroke: '1px rgb(201 169 110 / 0.6)', fontVariationSettings: '"wght" 800'}}
            >
              {text}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
