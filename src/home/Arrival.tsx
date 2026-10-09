import {useEffect, useRef} from 'react';
import {Pill} from '../components/Pill';
import {Shards, driveShards, useShardRefs, type Shard} from '../components/Shards';
import {hero} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {onArch} from '../lib/arch';
import {clamp, easeInQuad, easeOutCubic, lerp, pinProgress, range, smoothstep} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {u} from '../lib/url';

/**
 * The hero. One pinned stage, one scroll range:
 *
 *   0.02 – 0.46  petals and gold leaf burst out from BEHIND the arch, one
 *                after another, and drift to their places at three depths.
 *                Each stays behind the arch until it has cleared its outline
 *                (lib/arch.ts), then the near ones pass in front.
 *   0.10 – 0.32  the title rises out of its masks, hairline → heavy
 *   0.10 – 0.85  golden hour fades: the glow sinks, the sky goes to night and
 *                the festoon lights come up; the countdown runs to the day
 *   0.30 – 0.74  everything drifts upward at its own depth — confetti falling
 *   0.74 – 1.00  the arch sinks out of frame, the petals rush past, the
 *                title parts, and hairlines draw the next room
 *
 * Stacking inside the stage: sky 0 · far petals 10 · emerging petals 22 ·
 * title 25 · arch 30 · outlined title 35 · near petals 40 · lens petals 50 ·
 * UI 60.
 */

const STAGE = 'h-[480svh]';

// The arch's box: width / height. Its top is a semicircle as wide as the box.
const ARCH_RATIO = 0.58;

// Rest positions (% of the stage), size (vmin), depth 0 far → 1 at the lens.
const BACK: Shard[] = [
  {piece: 'f13', x: 10, y: 20, h: 5, depth: 0.14, rot: 20, spin: 60},
  {piece: 'f05', x: 24, y: 10, h: 7, depth: 0.2, rot: -30, spin: -40},
  {piece: 'f11', x: 33, y: 66, h: 5, depth: 0.26, rot: 40, spin: 50},
  {piece: 'f02', x: 68, y: 9, h: 7, depth: 0.16, rot: 0, spin: -70},
  {piece: 'f03', x: 82, y: 30, h: 8, depth: 0.3, rot: 25, spin: 30},
  {piece: 'f12', x: 90, y: 62, h: 5, depth: 0.22, rot: -15, spin: -45},
  {piece: 'f07', x: 15, y: 80, h: 6, depth: 0.18, rot: 60, spin: 80},
  {piece: 'f14', x: 60, y: 80, h: 5, depth: 0.28, rot: -40, spin: 35},
  {piece: 'f10', x: 44, y: 6, h: 4, depth: 0.12, rot: 10, spin: -90},
  {piece: 'f09', x: 76, y: 72, h: 6, depth: 0.2, rot: 70, spin: 40},
];

const MID: Shard[] = [
  {piece: 'f01', x: 13, y: 34, h: 13, depth: 0.55, rot: -18, spin: 70},
  {piece: 'f10', x: 25, y: 56, h: 8, depth: 0.5, rot: 30, spin: -55},
  {piece: 'f04', x: 82, y: 20, h: 14, depth: 0.62, rot: 12, spin: -35},
  {piece: 'f12', x: 89, y: 48, h: 8, depth: 0.52, rot: -30, spin: 45},
  {piece: 'f06', x: 72, y: 62, h: 15, depth: 0.6, rot: 20, spin: 60},
  {piece: 'f08', x: 18, y: 76, h: 13, depth: 0.66, rot: -10, spin: -50},
  {piece: 'f13', x: 34, y: 22, h: 7, depth: 0.46, rot: 45, spin: 90},
  {piece: 'f02', x: 64, y: 34, h: 11, depth: 0.48, rot: -25, spin: -60},
  {piece: 'f14', x: 93, y: 84, h: 8, depth: 0.58, rot: 15, spin: 70},
  {piece: 'f05', x: 50, y: 93, h: 11, depth: 0.54, rot: -35, spin: -40},
];

const FRONT: Shard[] = [
  {piece: 'f03', x: -2, y: 68, h: 34, depth: 0.95, rot: 18, spin: 25, blur: true},
  {piece: 'f09', x: 98, y: 12, h: 30, depth: 0.9, rot: -22, spin: -20, blur: true},
  {piece: 'f11', x: 86, y: 94, h: 22, depth: 0.92, rot: 40, spin: 30, blur: true},
  {piece: 'f07', x: 6, y: 6, h: 26, depth: 0.88, rot: -30, spin: -25, blur: true},
  {piece: 'f01', x: 40, y: -6, h: 22, depth: 0.86, rot: 12, spin: 20, blur: true},
];

const LAYERS = [
  {shards: BACK, z: 10},
  {shards: MID, z: 40},
  {shards: FRONT, z: 50},
] as const;
const EMERGING_Z = 22;

// Emergence order interleaves the layers so the burst reads as one stream.
const ORDER: number[][] = LAYERS.map(({shards}, li) => shards.map((_, i) => i * 3 + li));
const TOTAL = BACK.length + MID.length + FRONT.length;

// Festoon lights that come up as night falls: fixed, hand-placed positions.
const LIGHTS = Array.from({length: 26}, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: 6 + ((i * 53) % 38),
  s: 3 + ((i * 7) % 5),
  d: (i * 0.37) % 3,
}));

function Letters({text, italic, fill}: {text: string; italic?: boolean; fill?: boolean}) {
  return (
    <span className="inline-flex whitespace-pre">
      {Array.from(text).map((ch, i) => (
        <span key={i} className={`mask-line ${italic ? 'mask-italic' : ''}`}>
          <span data-ch className={`inline-block will-change-transform ${fill ? (italic ? 'fill-gold' : 'fill-ivory') : ''} ${italic ? '-mx-[0.08em] px-[0.08em]' : ''}`}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Arrival() {
  const rootRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const titleBackRef = useRef<HTMLDivElement>(null);
  const titleFrontRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLSpanElement>(null);
  const planRef = useRef<HTMLSpanElement>(null);
  const planBarRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const back = useShardRefs();
  const mid = useShardRefs();
  const front = useShardRefs();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const stores = [back, mid, front];
    // Once a piece has cleared the arch it may pass in front; latched.
    const cleared = LAYERS.map(({shards}) => shards.map(() => false));
    let lastDays = -1;

    return onFrame((time) => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      const vw = window.innerWidth;
      const vmin = Math.min(vw, vh) / 100;
      const still = reducedRef.current;
      const t = still ? 0 : time / 1000;
      const px = pointer.x;
      const py = pointer.y;
      const exit = range(p, 0.74, 1);
      const fall = easeInQuad(exit);

      // Sky: settles from a slow push-in, sinks a touch, tilts under the cursor.
      const settle = easeOutCubic(range(p, 0, 0.45));
      skyRef.current!.style.transform = `translate3d(${px * -0.8}vw, ${lerp(0, -5, p) + py * -0.6}vh, 0) scale(${lerp(1.14, 1.03, settle)})`;
      smokeRef.current!.style.opacity = String(smoothstep(range(p, 0.12, 0.5)));
      const night = smoothstep(range(p, 0.48, 0.84));
      nightRef.current!.style.opacity = String(night * 0.92);
      lightsRef.current!.style.opacity = String(smoothstep(range(p, 0.4, 0.7)) * (1 - range(p, 0.86, 0.98)));
      lightsRef.current!.style.transform = `translate3d(${px * -1.4}vw, ${-p * 10}vh, 0)`;
      const sun = sunRef.current!;
      sun.style.opacity = String((1 - range(p, 0.25, 0.7)) * (0.85 + Math.sin(t * 1.3) * 0.08));
      sun.style.transform = `translate3d(${px * -1.2}vw, ${p * 36}vh, 0)`;

      // The arch: breathes, leans with the cursor, and at the end sinks away.
      const float = Math.sin(t * 0.9) * 0.5;
      const lift = easeOutCubic(range(p, 0, 0.3));
      const arch = archRef.current!;
      arch.style.transform = `translate3d(calc(-50% + ${px * 0.9}vw), ${lerp(3, 0, lift) + float + fall * 105}vh, 0) rotate(${px * 0.6}deg) scale(${lerp(1.04, 1, lift) - fall * 0.06})`;
      const ar = arch.getBoundingClientRect();
      const aspect = ar.height / Math.max(1, ar.width);

      // Petals burst out from behind the arch.
      LAYERS.forEach(({shards, z}, li) =>
        driveShards(stores[li], shards, (s, i) => {
          const k = ORDER[li][i] / TOTAL;
          const e = easeOutCubic(range(p, 0.02 + k * 0.26, 0.2 + k * 0.26));
          // Origin: somewhere behind the couple, a little different for each.
          const ox = 50 + (((i * 37 + li * 11) % 9) - 4);
          const oy = 58 + (((i * 53 + li * 7) % 17) - 8);
          const out = 1 - e;
          let x = (ox - s.x) * out;
          let y = (oy - s.y) * out - Math.sin(Math.PI * e) * (4 + s.depth * 6);
          // Confetti falling past the camera: everything drifts, nearer pieces faster.
          y -= p * (6 + s.depth * 34);
          y -= fall * (40 + s.depth * 120);
          // Idle float + diorama tilt, once they're out.
          y += e * (Math.sin(t * 0.6 + i * 1.7) * (0.4 + s.depth * 0.9) + py * (s.depth - 0.35) * 2.4);
          x += e * (Math.cos(t * 0.45 + i) * 0.25 + px * (s.depth - 0.35) * 3.2);
          const r = s.rot * e + p * s.spin + Math.sin(t * 0.5 + i) * 4;

          // Behind the arch until the piece's footprint is clear of it.
          let zi: number = z;
          if (z > 30) {
            if (e < 0.05) cleared[li][i] = false;
            if (!cleared[li][i]) {
              const cx = ((s.x + x) / 100) * vw;
              const cy = ((s.y + y) / 100) * vh;
              const rad = s.h * vmin * 0.32 * lerp(0.3, 1, e);
              const hit = [
                [0, 0],
                [rad, 0],
                [-rad, 0],
                [0, rad],
                [0, -rad],
              ].some(([dx, dy]) => onArch((cx + dx - ar.left) / ar.width, (cy + dy - ar.top) / ar.height, aspect));
              if (!hit && e > 0.2) cleared[li][i] = true;
            }
            if (!cleared[li][i]) zi = EMERGING_Z;
          }
          return {x, y, r, s: lerp(0.28, 1, e), o: clamp(e * 5), z: zi};
        }),
      );

      // Title: rises letter by letter while thickening from hairline to heavy.
      const tIn = range(p, 0.1, 0.32);
      const weight = Math.round(lerp(180, 860, easeOutCubic(tIn)));
      const part = easeInQuad(exit);
      [titleBackRef.current!, titleFrontRef.current!].forEach((title, k) => {
        title.style.fontVariationSettings = `"wght" ${weight}`;
        title.style.opacity = String((1 - range(p, 0.84, 0.96)) * (k === 1 ? 0.55 : 1));
        const halves = title.children;
        (halves[0] as HTMLElement).style.transform = `translate3d(${-part * 24 + px * -0.5}vw, ${-p * 4}vh, 0)`;
        (halves[1] as HTMLElement).style.transform = `translate3d(${part * 24 + px * -0.5}vw, ${-p * 4}vh, 0)`;
        const letters = title.querySelectorAll<HTMLElement>('[data-ch]');
        const n = letters.length;
        letters.forEach((el, i) => {
          const lt = easeOutCubic(clamp(tIn * 1.8 - (i / n) * 0.8));
          el.style.transform = `translate3d(0, ${(1 - lt) * 105}%, 0)`;
        });
      });

      // Intro copy leaves as the petals arrive; the CTA takes its place.
      const intro = introRef.current!;
      intro.style.opacity = String(1 - range(p, 0.02, 0.1));
      intro.style.transform = `translate3d(0, ${-range(p, 0, 0.1) * 4}vh, 0)`;
      intro.style.visibility = p > 0.1 ? 'hidden' : 'visible';
      const cta = ctaRef.current!;
      const ctaIn = easeOutCubic(range(p, 0.24, 0.34));
      cta.style.opacity = String(ctaIn * (1 - range(p, 0.7, 0.78)));
      cta.style.transform = `translate3d(-50%, ${(1 - ctaIn) * 3 + fall * 60}vh, 0)`;
      cta.style.pointerEvents = ctaIn > 0.5 && p < 0.74 ? 'auto' : 'none';

      // Countdown: a year of planning, run down to the day.
      hudRef.current!.style.opacity = String(range(p, 0.04, 0.14) * (1 - range(p, 0.8, 0.9)));
      const days = Math.round(lerp(365, 0, smoothstep(range(p, 0.02, 0.96))));
      if (days !== lastDays) {
        lastDays = days;
        daysRef.current!.textContent = days === 0 ? 'Today' : String(days);
        const planned = Math.round(range(p, 0.08, 0.8) * 100);
        planRef.current!.textContent = `${planned}%`;
        planBarRef.current!.style.transform = `scaleX(${planned / 100})`;
      }

      // Hairlines draw the next room in the dark.
      const draw = range(p, 0.8, 0.99);
      const svg = linesRef.current!;
      svg.style.opacity = String(draw > 0 ? 1 : 0);
      svg.querySelectorAll<SVGPathElement>('path').forEach((path, i) => {
        path.style.strokeDashoffset = String(1 - easeOutCubic(clamp(draw * 1.4 - i * 0.2)));
      });
    });
  }, [back, mid, front]);

  const title = (outline: boolean) => (
    <div
      ref={outline ? titleFrontRef : titleBackRef}
      aria-hidden={outline || undefined}
      className={`caps pointer-events-none absolute inset-x-0 top-[17%] flex flex-col items-center gap-[1svh] px-5 text-hero md:top-[79%] md:-translate-y-1/2 md:flex-row md:items-baseline md:justify-between md:gap-0 md:px-[4vw] ${
        outline ? 'z-35 text-transparent [-webkit-text-stroke:1px_rgb(244_239_230_/_0.9)]' : 'z-25 text-ivory'
      }`}
      style={{fontVariationSettings: '"wght" 180'}}
    >
      {/* Heavy poster caps, answered by a romantic serif italic. */}
      <span className="tracking-[-0.012em] will-change-transform max-md:self-start">
        <Letters text={hero.left} fill={!outline} />
      </span>
      <span
        className="accent text-[1.02em] leading-[0.8] tracking-[-0.035em] will-change-transform max-md:self-end"
        style={{fontVariationSettings: '"wght" 400'}}
      >
        <Letters text={hero.right} italic fill={!outline} />
      </span>
    </div>
  );

  return (
    <section ref={rootRef} id="top" className={`relative ${STAGE} bg-ink`} aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        {hero.left} {hero.right} — Warren-Stone Weddings and Events, luxury wedding planners
      </h1>
      <div className="sticky top-0 h-screen-s overflow-hidden">
        {/* Golden-hour sky over the Cape mountains */}
        <div ref={skyRef} className="absolute -inset-[4%] will-change-transform">
          <picture>
            <source media="(max-width: 767px)" srcSet={u('/media/sky-m.webp')} />
            <img src={u('/media/sky.webp')} alt="" className="size-full object-cover object-[50%_60%]" fetchPriority="high" />
          </picture>
        </div>
        <div
          ref={sunRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[-18%] left-[55%] size-[60vmax] -translate-x-1/2 rounded-full mix-blend-screen will-change-transform"
          style={{background: 'radial-gradient(closest-side, rgb(246 234 208 / 0.55), rgb(201 169 110 / 0.22) 45%, transparent 72%)'}}
        />
        <div ref={smokeRef} aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-transparent opacity-0" />
        <div ref={nightRef} aria-hidden="true" className="absolute inset-0 bg-ink opacity-0" />
        {/* Festoon lights, warm and out of focus, for the evening */}
        <div ref={lightsRef} aria-hidden="true" className="absolute inset-0 opacity-0 will-change-transform">
          {LIGHTS.map((l, i) => (
            <span
              key={i}
              className="absolute rounded-full motion-safe:animate-pulse"
              style={{
                left: `${l.x}%`,
                top: `${l.y}%`,
                width: `${l.s}px`,
                height: `${l.s}px`,
                background: 'rgb(246 220 160)',
                boxShadow: `0 0 ${l.s * 4}px ${l.s}px rgb(232 190 110 / 0.45)`,
                animationDelay: `${l.d}s`,
                animationDuration: '3.2s',
              }}
            />
          ))}
        </div>
        {/* Vignette keeps the edges heavy, like candlelight in a marquee. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgb(10_9_8_/_0.7)_100%)]" />

        <Shards shards={BACK} store={back} />
        {title(false)}

        {/* The arch: a doorway framing the couple, standing on the floor. */}
        <div
          ref={archRef}
          className="absolute bottom-[-6svh] left-1/2 z-30 h-[56svh] will-change-transform md:h-[86svh]"
          style={{aspectRatio: String(ARCH_RATIO), transformOrigin: '50% 80%', transform: 'translate3d(-50%, 3vh, 0)'}}
        >
          <div className="relative size-full animate-[arch-in_1.8s_var(--ease-carve)_both]">
            <div aria-hidden="true" className="arch absolute -inset-[14px] bottom-0 border border-b-0 border-gold/55" />
            <div aria-hidden="true" className="arch absolute -inset-[28px] bottom-0 border border-b-0 border-gold/20 max-md:hidden" />
            <div className="arch relative size-full overflow-hidden bg-coal shadow-[0_0_120px_10px_rgb(201_169_110_/_0.18)]">
              <img
                src={u('/media/arch.webp')}
                srcSet={u('/media/arch-m.webp 640w, /media/arch.webp 1100w')}
                sizes="(max-width: 767px) 60vw, 50svh"
                alt={hero.arch}
                className="size-full object-cover object-[50%_40%]"
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-ink via-ink/60 to-transparent" />
            </div>
          </div>
        </div>

        {title(true)}
        <Shards shards={MID} store={mid} />
        <Shards shards={FRONT} store={front} />

        {/* Intro copy (visible before the first scroll) */}
        <div ref={introRef} className="absolute inset-x-5 bottom-8 z-60 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-10">
          {/* On phones the caption sits over the photo; a veil of dark keeps it legible. */}
          <div aria-hidden="true" className="absolute -inset-x-5 -bottom-8 top-[-14svh] -z-10 bg-linear-to-t from-ink via-ink/80 to-transparent md:hidden" />
          <div className="max-w-[23rem] animate-[fade-up_1.2s_0.6s_var(--ease-carve)_both]">
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span aria-hidden="true" className="block h-px w-8 bg-gold/70" />
              {hero.kicker}
            </p>
            <p className="mt-4 font-serif text-[clamp(1.2rem,1.55vw,1.5rem)] leading-[1.25] font-normal text-ivory/90 italic">{hero.caption}</p>
          </div>
          <div className="flex flex-col items-center gap-3 animate-[fade-up_1.2s_0.9s_var(--ease-carve)_both] max-md:hidden" aria-hidden="true">
            <span className="eyebrow text-linen">{hero.hint}</span>
            <span className="relative block h-12 w-px overflow-hidden bg-ivory/15">
              <span className="absolute inset-0 bg-ivory animate-[hint-drop_2.2s_var(--ease-carve)_infinite]" />
            </span>
          </div>
          <p className="text-right animate-[fade-up_1.2s_0.75s_var(--ease-carve)_both] max-sm:hidden">
            <span className="eyebrow block text-ash">{hero.metaLabel}</span>
            <span className="mt-2 block font-serif text-[1.4rem] leading-none font-medium tracking-[0.02em] text-ivory">{hero.meta}</span>
          </p>
        </div>

        {/* CTA at the foot of the arch */}
        <div ref={ctaRef} className="absolute bottom-[5svh] left-1/2 z-60 opacity-0" style={{transform: 'translate3d(-50%, 3vh, 0)'}}>
          <Pill href="#details" tone="glass" arrow="down">
            {hero.cta}
          </Pill>
        </div>

        {/* Countdown HUD */}
        <div ref={hudRef} aria-hidden="true" className="absolute top-[36%] right-5 z-60 opacity-0 md:top-1/2 md:right-10 md:-translate-y-1/2">
          <div className="flex flex-col items-end gap-5 text-right">
            <div>
              <p className="eyebrow text-ash">Days to I do</p>
              <p className="caps tabular mt-1 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none text-ivory" style={{fontVariationSettings: '"wght" 600'}}>
                <span ref={daysRef}>365</span>
              </p>
            </div>
            <div className="w-28">
              <p className="eyebrow flex justify-between text-ash">
                Planned <span ref={planRef} className="tabular text-gold">0%</span>
              </p>
              <span className="mt-2 block h-px w-full bg-ivory/15">
                <span ref={planBarRef} className="block h-full origin-left bg-gold" style={{transform: 'scaleX(0)'}} />
              </span>
            </div>
          </div>
        </div>

        {/* Hairlines that open the next room */}
        <svg ref={linesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-60 size-full opacity-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {['M 62 0 L 62 18 L 100 18', 'M 0 72 L 38 72 L 38 100', 'M 50 0 L 50 46'].map((d) => (
            <path key={d} d={d} pathLength={1} fill="none" stroke="rgb(201 169 110 / 0.55)" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
          ))}
        </svg>
      </div>
    </section>
  );
}
