import {useEffect, useRef} from 'react';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {Shards, driveShards, useShardRefs, type Shard} from './Shards';

/**
 * The opening of every inner page. One pinned stage, one scroll range:
 *
 *   load        the page opens on a full-bleed photograph; the title rises
 *               letter by letter over it (on time, not scroll — it is the h1)
 *   0.04 – 0.55 the photograph closes into an arch — a doorway into the
 *               chapter
 *   0.42 – 0.62 a gold hairline traces the arch
 *   0.80 – 1.00 the copy lifts away as the next section arrives
 *
 * The arch is a clip-path computed in pixels every frame, so the top stays
 * a true semicircle at every width.
 */

const BITS: Shard[] = [
  {piece: 'f02', x: 12, y: 18, h: 8, depth: 0.35, rot: 20, spin: 70},
  {piece: 'f10', x: 46, y: 86, h: 6, depth: 0.3, rot: -10, spin: -90},
  {piece: 'f05', x: 92, y: 12, h: 10, depth: 0.5, rot: 30, spin: -50},
  {piece: 'f12', x: 54, y: 30, h: 5, depth: 0.25, rot: 0, spin: 80},
  {piece: 'f08', x: 4, y: 74, h: 30, depth: 0.92, rot: -25, spin: 30, blur: true},
];

/**
 * Letters grouped by word, so a long title wraps between words, never inside
 * one. They rise on load (the title is the page's h1 and must read at once),
 * staggered left to right.
 */
function Letters({text}: {text: string}) {
  let n = 0;
  return (
    <span className="flex flex-wrap gap-x-[0.22em]">
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-flex whitespace-nowrap">
          {Array.from(word).map((ch, i) => (
            <span key={i} className="mask-line">
              <span className="fill-ivory rise-in inline-block" style={{animationDelay: `${250 + n++ * 45}ms`}}>
                {ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function PageHero({
  numeral,
  eyebrow,
  title,
  accent,
  intro,
  image,
  imageAlt,
}: {
  numeral: string;
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  imageAlt: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const bits = useShardRefs();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(
    () =>
      onFrame((time) => {
        const root = rootRef.current;
        if (!root) return;
        const {p, rect, vh} = pinProgress(root);
        if (rect.bottom < 0 || rect.top > vh) return;
        const vw = window.innerWidth;
        const md = vw >= 768;
        const t = reducedRef.current ? 0 : time / 1000;
        const px = pointer.x;
        const py = pointer.y;

        // The photograph closes into an arch.
        const k = easeOutCubic(range(p, 0.04, 0.55));
        const target = md
          ? {l: vw * 0.58, r: vw * 0.06, t: vh * 0.16, b: vh * 0.08}
          : {l: vw * 0.12, r: vw * 0.12, t: vh * 0.5, b: vh * 0.04};
        const L = lerp(0, target.l, k);
        const R = lerp(0, target.r, k);
        const T = lerp(0, target.t, k);
        const B = lerp(0, target.b, k);
        const rad = lerp(0, (vw - target.l - target.r) / 2, k);
        photoRef.current!.style.clipPath = `inset(${T.toFixed(1)}px ${R.toFixed(1)}px ${B.toFixed(1)}px ${L.toFixed(1)}px round ${rad.toFixed(1)}px ${rad.toFixed(1)}px 0 0)`;
        imgRef.current!.style.transform = `translate3d(${px * -0.8}vw, ${py * -0.6 + lerp(0, -3, p)}vh, 0) scale(${lerp(1.16, 1.04, k)})`;
        shadeRef.current!.style.opacity = String(lerp(1, 0.25, k));

        // A gold hairline traces the arch once it has formed.
        const line = lineRef.current!;
        const g = 14;
        line.style.left = `${target.l - g}px`;
        line.style.right = `${target.r - g}px`;
        line.style.top = `${target.t - g}px`;
        line.style.bottom = `${target.b}px`;
        line.style.opacity = String(easeOutCubic(range(p, 0.42, 0.62)));
        line.style.transform = `translate3d(0, ${(1 - range(p, 0.42, 0.62)) * 2}vh, 0)`;

        hintRef.current!.style.opacity = String(1 - range(p, 0.02, 0.12));

        const leave = easeOutCubic(range(p, 0.8, 1));
        copyRef.current!.style.transform = `translate3d(0, ${-leave * 8}vh, 0)`;
        copyRef.current!.style.opacity = String(1 - leave * 0.9);

        driveShards(bits, BITS, (s, i) => ({
          x: px * (s.depth - 0.3) * 4 + Math.cos(t * 0.4 + i) * 0.4,
          y: (0.5 - p) * s.depth * 50 + Math.sin(t * 0.6 + i * 2) * 0.8,
          r: s.rot + p * s.spin,
          s: 1,
          o: clamp(range(p, 0.05, 0.3) * 1.4),
        }));
      }),
    [bits],
  );

  return (
    <section ref={rootRef} id="top" className="relative h-[220svh] bg-ink" aria-labelledby="page-title">
      <div className="sticky top-0 h-screen-s overflow-hidden">
        <div ref={photoRef} className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <img
            ref={imgRef}
            src={`${image}`}
            srcSet={`${image.replace('.webp', '-m.webp')} 800w, ${image} 1600w`}
            sizes="100vw"
            alt={imageAlt}
            fetchPriority="high"
            className="absolute -inset-[3%] size-[106%] max-w-none object-cover will-change-transform"
          />
          <div ref={shadeRef} aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/55 to-ink/10 max-md:bg-linear-to-b max-md:from-ink/85 max-md:via-ink/50" />
        </div>
        <div ref={lineRef} aria-hidden="true" className="arch pointer-events-none absolute border border-b-0 border-gold/60 opacity-0" />
        <Shards shards={BITS} store={bits} />

        <div
          ref={copyRef}
          className="relative z-10 flex h-full flex-col justify-start px-5 pt-[17svh] md:w-[56vw] md:justify-center md:pt-0 md:pl-[6vw]"
        >
          <p className="eyebrow flex items-center gap-4 text-gold animate-[fade-up_1.2s_0.3s_var(--ease-carve)_both]">
            <span className="accent text-[1.2rem] tracking-normal normal-case">{numeral}.</span>
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            {eyebrow}
          </p>
          <h1 id="page-title" className="caps mt-6 text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.84] tracking-[-0.01em]" style={{fontVariationSettings: '"wght" 840'}}>
            <span className="sr-only">
              {title} {accent}
            </span>
            <span aria-hidden="true" className="block">
              <Letters text={title} />
            </span>
            <span aria-hidden="true" className="mask-line mask-italic pb-[0.14em]">
              <span className="accent fill-gold rise-in block text-[1.12em] leading-[0.95] md:pl-[0.9em]" style={{animationDelay: '650ms'}}>
                {accent}
              </span>
            </span>
          </h1>
          <div className="mt-8 max-w-[30rem] border-t border-ivory/15 pt-6 animate-[fade-up_1.2s_0.9s_var(--ease-carve)_both] max-md:max-w-[22rem]">
            <p className="text-lead text-linen max-md:text-[1rem]">{intro}</p>
          </div>
        </div>

        <div ref={hintRef} className="absolute bottom-8 left-5 z-10 flex items-center gap-4 md:left-[6vw]" aria-hidden="true">
          <span className="relative block h-12 w-px overflow-hidden bg-ivory/15">
            <span className="absolute inset-0 bg-ivory animate-[hint-drop_2.2s_var(--ease-carve)_infinite]" />
          </span>
          <span className="eyebrow text-linen">Scroll</span>
        </div>
      </div>
    </section>
  );
}
