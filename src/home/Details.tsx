import {useEffect, useRef} from 'react';
import {Pill} from '../components/Pill';
import {Shards, driveShards, useShardRefs, type Shard} from '../components/Shards';
import {details} from '../content';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';

/**
 * "Every detail is a promise, kept beautifully." A pinned room: the headline
 * rises out of its masks on the left while four close-ups of real weddings
 * fly in from the corners and lock together into one great diamond, split
 * by a black cross. Each close-up arrives out of focus and sharpens in turn
 * (a pre-blurred twin crossfades out — no live CSS blur on big images).
 * At the end the diamond turns a few degrees and lifts away.
 */

// Diamond quadrants, in the rotated square's own axes.
const QUAD = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
] as const;

const DRIFT: Shard[] = [
  {piece: 'f13', x: 44, y: 16, h: 4, depth: 0.3, rot: 10, spin: 90},
  {piece: 'f05', x: 8, y: 88, h: 7, depth: 0.5, rot: -30, spin: -60},
  {piece: 'f11', x: 52, y: 80, h: 5, depth: 0.45, rot: 50, spin: 70},
  {piece: 'f02', x: 38, y: 58, h: 4, depth: 0.2, rot: -10, spin: -80},
];

const FRONT: Shard[] = [{piece: 'f04', x: 97, y: 94, h: 22, depth: 0.92, rot: 25, spin: 30, blur: true}];

export function Details() {
  const rootRef = useRef<HTMLElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<HTMLDivElement[]>([]);
  const sharpRefs = useRef<HTMLImageElement[]>([]);
  const innerRefs = useRef<HTMLDivElement[]>([]);
  const copyRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const drift = useShardRefs();
  const lens = useShardRefs();

  useEffect(() => {
    let lastCount = -1;
    return onFrame((time) => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const t = time / 1000;
      const px = pointer.x;
      const py = pointer.y;
      // How far the room is from settling in (for the entrance before pinning).
      const approach = clamp(rect.top / window.innerHeight);

      // Headline lines rise from their masks.
      const copy = copyRef.current!;
      copy.querySelectorAll<HTMLElement>('[data-line]').forEach((el, i) => {
        const k = easeOutCubic(range(p, 0.02 + i * 0.05, 0.2 + i * 0.05));
        el.style.transform = `translate3d(0, ${(1 - k) * 108}%, 0)`;
      });
      copy.querySelectorAll<HTMLElement>('[data-fade]').forEach((el, i) => {
        const k = easeOutCubic(range(p, 0.16 + i * 0.05, 0.32 + i * 0.05));
        el.style.opacity = String(k);
        el.style.transform = `translate3d(0, ${(1 - k) * 3}vh, 0)`;
      });
      const leave = easeOutCubic(range(p, 0.82, 1));
      copy.style.transform = `translate3d(0, ${-leave * 12}vh, 0)`;
      copy.style.opacity = String(1 - leave);

      // The quadrants assemble, one after another.
      let focused = 0;
      cellRefs.current.forEach((cell, i) => {
        const a = easeOutCubic(range(p, 0.04 + i * 0.07, 0.36 + i * 0.07));
        const [qx, qy] = QUAD[i];
        const far = (1 - a) * 70;
        cell.style.transform = `translate3d(${qx * far}%, ${qy * far}%, 0) scale(${lerp(0.72, 1, a)})`;
        cell.style.opacity = String(clamp(a * 1.6));
        const f = easeOutCubic(range(p, 0.3 + i * 0.09, 0.46 + i * 0.09));
        sharpRefs.current[i].style.opacity = String(f);
        if (f > 0.5) focused = i + 1;
        // Inside each window, the close-up pans against the scroll.
        innerRefs.current[i].style.transform = `translate3d(${(0.5 - p) * 6 + px * 1.2}%, ${(0.5 - p) * 10 + py * 1.2}%, 0) rotate(-45deg) scale(1.5)`;
      });
      if (focused !== lastCount) {
        lastCount = focused;
        countRef.current!.textContent = String(Math.max(1, focused)).padStart(2, '0');
      }

      const turn = easeOutCubic(range(p, 0.72, 1));
      diamondRef.current!.style.transform = `translate3d(calc(-50% + ${px * -1}vw), calc(-50% + ${approach * 18 - turn * 26 + py * -0.8}vh), 0) rotate(${45 + turn * 12 + px * 1.5}deg) scale(${lerp(1, 0.9, turn)})`;

      lineRef.current!.style.transform = `scaleY(${easeOutCubic(range(p, 0, 0.3))})`;

      const float = (s: Shard, i: number) => ({
        x: px * (s.depth - 0.35) * 3 + Math.cos(t * 0.4 + i) * 0.3,
        y: (0.5 - p) * s.depth * 40 + approach * s.depth * 30 + Math.sin(t * 0.6 + i * 2) * 0.6,
        r: s.rot + p * s.spin,
        s: 1,
        o: 1,
      });
      driveShards(drift, DRIFT, float);
      driveShards(lens, FRONT, float);
    });
  }, [drift, lens]);

  return (
    <section ref={rootRef} id="details" className="relative h-[280svh] bg-ink" aria-labelledby="details-title">
      <div className="sticky top-0 h-screen-s overflow-hidden">
        {/* Candle glow low on the right, where the diamond sits. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_60%,rgb(154_116_66_/_0.3),transparent_70%)]" />
        {/* Hairline + index on the left edge, as a rail. */}
        <div aria-hidden="true" className="absolute top-0 left-5 flex h-[46svh] flex-col items-center md:left-10">
          <span ref={lineRef} className="block w-px flex-1 origin-top bg-gold/60" />
          <span className="mt-3 block size-1.5 rounded-full bg-gold" />
        </div>

        <Shards shards={DRIFT} store={drift} />

        {/* The diamond */}
        <div
          ref={diamondRef}
          style={{transform: 'translate3d(-50%, -50%, 0) rotate(45deg)'}}
          className="absolute top-[66%] left-1/2 aspect-square w-[min(80vw,50svh)] will-change-transform md:top-1/2 md:left-[70%] md:w-[min(56vw,80svh)]"
        >
          <div className="grid size-full grid-cols-2 gap-[clamp(8px,1.1vw,16px)]">
            {details.tiles.map((tile, i) => (
              <div
                key={tile.src}
                ref={(el) => {
                  if (el) cellRefs.current[i] = el;
                }}
                className="group relative overflow-hidden bg-coal opacity-0 shadow-[0_30px_60px_-20px_rgb(0_0_0_/_0.8)] will-change-transform"
              >
                <div
                  ref={(el) => {
                    if (el) innerRefs.current[i] = el;
                  }}
                  className="absolute inset-0 will-change-transform"
                  style={{transform: 'rotate(-45deg) scale(1.5)'}}
                >
                  <img src={tile.src.replace('.webp', '-b.webp')} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <img
                    ref={(el) => {
                      if (el) sharpRefs.current[i] = el;
                    }}
                    src={tile.src}
                    alt={`${tile.label} — ${tile.alt}`}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover opacity-0 transition-[filter] duration-700 group-hover:brightness-110"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_55%,rgb(10_9_8_/_0.55))]" />
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div ref={copyRef} className="relative z-10 flex h-full flex-col justify-start px-5 pt-[14svh] md:w-[54vw] md:justify-center md:pt-0 md:pl-[8vw]">
          <p data-fade className="eyebrow flex items-center gap-4 text-gold opacity-0">
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            {details.eyebrow}
            <span className="font-serif text-[1.05rem] font-normal tracking-normal text-ash normal-case italic">
              no. <span ref={countRef} className="tabular">01</span> of 04
            </span>
          </p>
          <h2 id="details-title" className="caps mt-6 text-display tracking-[-0.012em] md:w-[62vw]" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="mask-line">
              <span data-line className="fill-ivory block">{details.titleA}</span>
            </span>
            <span className="mask-line">
              <span data-line className="fill-ivory block">{details.titleB}</span>
            </span>
            <span className="mask-line mask-italic pb-[0.14em]">
              <span data-line className="accent block text-[0.98em] text-gold [filter:drop-shadow(0_2px_14px_rgb(0_0_0_/_0.75))] leading-[0.92] tracking-[-0.03em] md:pl-[0.5em]">
                {details.accent}
              </span>
            </span>
          </h2>
          <div data-fade className="mt-8 max-w-[27rem] border-t border-ivory/15 pt-6 opacity-0 max-md:hidden">
            <p className="font-serif text-[1.45rem] leading-[1.2] font-medium text-ivory italic">{details.lead}</p>
            <p className="mt-3 text-[1rem] leading-[1.75] text-linen">{details.body}</p>
          </div>
          <div data-fade className="mt-9 opacity-0 max-md:mt-6">
            <Pill href={details.ctaHref}>{details.cta}</Pill>
          </div>
        </div>

        {/* Captions */}
        <ul className="absolute right-5 bottom-6 flex gap-7 max-md:hidden md:right-10 md:bottom-10">
          {details.tiles.map((tile) => (
            <li key={tile.label} className="flex items-baseline gap-2">
              <span className="font-serif text-[1rem] text-gold italic">{tile.note}</span>
              <span className="eyebrow text-ash">{tile.label}</span>
            </li>
          ))}
        </ul>

        {/* Out-of-focus petal across the lens */}
        <Shards shards={FRONT} store={lens} />
      </div>
    </section>
  );
}
