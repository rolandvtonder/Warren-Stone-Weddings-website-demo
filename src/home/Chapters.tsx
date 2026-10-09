import {useEffect, useRef} from 'react';
import {chapters} from '../content';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';

/**
 * The index of the site: one huge caps row per page. On a pointer device a
 * photograph in an arch follows the cursor and swaps as you move between
 * rows; on touch, each row carries its own small arch instead.
 */
const NUMERALS = ['i', 'ii', 'iii', 'iv'];

export function Chapters() {
  const listRef = useRef<HTMLUListElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('pointermove', move, {passive: true});
    const stop = onFrame(() => {
      const el = floatRef.current;
      if (!el) return;
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      const tilt = Math.max(-8, Math.min(8, (tx - x) * 0.05));
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
    });
    return () => {
      window.removeEventListener('pointermove', move);
      stop();
    };
  }, []);

  const show = (src: string) => {
    const img = imgRef.current;
    const el = floatRef.current;
    if (!img || !el) return;
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    el.style.opacity = '1';
  };
  const hide = () => {
    if (floatRef.current) floatRef.current.style.opacity = '0';
  };

  return (
    <section className="relative bg-ink px-5 py-[16svh] md:px-10" aria-labelledby="chapters-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="chapters-title" className="caps text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">{chapters.title}</span>
          </span>
          <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
            <span className="accent fill-gold text-[1.1em] leading-[0.95] md:pl-[1em]">{chapters.accent}</span>
          </span>
        </h2>
        <p className="eyebrow text-gold" data-reveal>
          {chapters.eyebrow}
        </p>
      </div>

      <ul ref={listRef} onMouseLeave={hide} className="mt-14 border-t border-ivory/12">
        {chapters.items.map((c, i) => (
          <li key={c.href} className="border-b border-ivory/12" data-reveal style={delay(i * 90)}>
            <a
              href={c.href}
              onMouseEnter={() => show(c.img)}
              onFocus={() => show(c.img)}
              onBlur={hide}
              className="group flex items-center gap-5 py-6 md:gap-10 md:py-8"
            >
              <span className="accent w-10 shrink-0 text-[1.6rem] text-gold md:w-16 md:text-[2.2rem]">{NUMERALS[i]}.</span>
              <span
                className="caps text-[clamp(3rem,9vw,8.5rem)] leading-[0.85] text-ivory transition-[color,transform] duration-700 ease-(--ease-carve) group-hover:translate-x-4 group-hover:text-gold"
                style={{fontVariationSettings: '"wght" 800'}}
              >
                {c.label}
              </span>
              <span className="accent ml-auto text-right text-[1.15rem] text-linen max-md:hidden md:text-[1.5rem]">{c.note}</span>
              <span className="arch relative ml-auto block h-20 w-14 shrink-0 overflow-hidden md:hidden" aria-hidden="true">
                <img src={c.img} alt="" loading="lazy" className="size-full object-cover" />
              </span>
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory transition-[transform,background-color,color] duration-700 ease-(--ease-carve) group-hover:-rotate-45 group-hover:bg-gold group-hover:text-ink max-md:hidden"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* The photograph that follows the cursor */}
      <div
        ref={floatRef}
        aria-hidden="true"
        className="arch pointer-events-none fixed top-0 left-0 z-30 h-[38svh] w-[26svh] overflow-hidden opacity-0 shadow-[0_40px_80px_-20px_rgb(0_0_0_/_0.8)] transition-opacity duration-500 max-md:hidden"
      >
        <img ref={imgRef} alt="" className="size-full object-cover" />
      </div>
    </section>
  );
}
