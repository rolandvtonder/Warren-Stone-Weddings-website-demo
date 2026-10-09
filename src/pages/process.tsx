import {useEffect, useRef} from 'react';
import {mount} from '../boot';
import {CtaBand} from '../components/CtaBand';
import {PageHero} from '../components/PageHero';
import {Shards, driveShards, useShardRefs, type Shard} from '../components/Shards';
import {processPage, promise, steps} from '../content';
import {clamp, easeOutCubic, pinProgress} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';

/**
 * The nine steps as one pinned room. Scroll runs a single number f from
 * 0 to 9; step i owns f ∈ [i, i+1):
 *
 *   – its photograph wipes up inside the arch over the one before,
 *   – its words rise in as the previous step's lift away,
 *   – the big counter and the rail of nine ticks advance.
 *
 * Every step stays in the DOM as an ordered list, so it reads in order
 * without the motion.
 */

const N = steps.length;

const BITS: Shard[] = [
  {piece: 'f05', x: 52, y: 14, h: 6, depth: 0.35, rot: 20, spin: 120},
  {piece: 'f12', x: 94, y: 70, h: 5, depth: 0.3, rot: -10, spin: -160},
  {piece: 'f01', x: 46, y: 88, h: 24, depth: 0.9, rot: 30, spin: 60, blur: true},
];

function Steps() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLLIElement[]>([]);
  const tickRefs = useRef<HTMLSpanElement[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const bits = useShardRefs();

  useEffect(() => {
    let lastActive = -1;
    return onFrame((time) => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      const t = time / 1000;
      const f = p * N;
      const active = Math.min(N - 1, Math.floor(f));

      imgRefs.current.forEach((el, i) => {
        // Each photo wipes up over the last in the first third of its step.
        const k = i === 0 ? 1 : easeOutCubic(clamp((f - i + 0.2) / 0.45));
        el.style.clipPath = `inset(${((1 - k) * 100).toFixed(2)}% 0 0 0)`;
        const img = el.firstElementChild as HTMLElement;
        img.style.transform = `translate3d(0, ${((i + 0.5 - f) * 4).toFixed(2)}%, 0) scale(${(1.14 - k * 0.06).toFixed(4)})`;
      });

      textRefs.current.forEach((el, i) => {
        const d = f - (i + 0.5);
        const o = i === 0 && f < 0.5 ? 1 : i === N - 1 && f > N - 0.5 ? 1 : clamp(1 - (Math.abs(d) - 0.3) / 0.18);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${(clamp(-d, -1, 1) * 5).toFixed(2)}vh, 0)`;
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      });

      tickRefs.current.forEach((el, i) => {
        el.style.transform = `scaleX(${clamp(f - i).toFixed(3)})`;
      });

      if (active !== lastActive) {
        lastActive = active;
        countRef.current!.textContent = String(active + 1).padStart(2, '0');
      }

      driveShards(bits, BITS, (s, i) => ({
        x: pointer.x * (s.depth - 0.3) * 4 + Math.cos(t * 0.4 + i) * 0.4,
        y: (0.5 - p) * s.depth * 60 + Math.sin(t * 0.6 + i * 2) * 0.8,
        r: s.rot + p * s.spin,
        s: 1,
        o: 1,
      }));
    });
  }, [bits]);

  return (
    <section ref={rootRef} id="steps" className="relative bg-ink" style={{height: `${N * 75 + 100}svh`}} aria-labelledby="steps-title">
      <h2 id="steps-title" className="sr-only">
        The nine steps of our planning process
      </h2>
      <div className="sticky top-0 h-screen-s overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_65%_at_75%_55%,rgb(154_116_66_/_0.22),transparent_70%)]" />

        {/* Photographs, stacked inside one arch */}
        <div className="absolute top-[13svh] right-5 left-5 h-[34svh] md:top-[14svh] md:right-[6vw] md:left-auto md:h-[76svh] md:w-[min(38vw,58svh)]">
          <div aria-hidden="true" className="arch absolute -inset-[12px] bottom-0 border border-b-0 border-gold/45 max-md:hidden" />
          <div className="arch relative size-full overflow-hidden bg-coal max-md:rounded-[24px]">
            {steps.map((s, i) => (
              <div
                key={s.img}
                ref={(el) => {
                  if (el) imgRefs.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden"
                style={{clipPath: i === 0 ? 'none' : 'inset(100% 0 0 0)'}}
              >
                <img
                  src={s.img}
                  srcSet={`${s.img.replace('.webp', '-m.webp')} 800w, ${s.img} 1600w`}
                  sizes="(max-width: 767px) 92vw, 38vw"
                  alt={s.alt}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="size-full object-cover will-change-transform"
                />
              </div>
            ))}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/40 to-transparent" />
          </div>
        </div>

        {/* Counter */}
        <div aria-hidden="true" className="absolute top-[50svh] left-5 flex items-baseline gap-3 md:top-[14svh] md:left-[6vw]">
          <span
            ref={countRef}
            className="caps tabular text-[clamp(4.5rem,12vw,11rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(201_169_110_/_0.8)]"
            style={{fontVariationSettings: '"wght" 800'}}
          >
            01
          </span>
          <span className="label text-ash">/ {String(N).padStart(2, '0')}</span>
        </div>

        {/* The words for each step */}
        <ol className="absolute right-5 bottom-[12svh] left-5 h-[30svh] md:top-[44svh] md:right-auto md:bottom-auto md:left-[6vw] md:h-[42svh] md:w-[min(44vw,40rem)]">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                if (el) textRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{opacity: i === 0 ? 1 : 0}}
            >
              <p className="label text-gold">Step {String(i + 1).padStart(2, '0')}</p>
              <h3 className="caps mt-3 text-[clamp(2.4rem,4.6vw,4.8rem)] leading-[0.88]" style={{fontVariationSettings: '"wght" 800'}}>
                <span className="fill-ivory">{s.title}</span> <span className="accent text-[1.05em] text-gold">{s.accent}</span>
              </h3>
              <p className="mt-5 max-w-[34rem] text-body text-linen max-md:text-[0.98rem] max-md:leading-[1.6]">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Rail of nine ticks */}
        <div aria-hidden="true" className="absolute right-5 bottom-[5svh] left-5 flex gap-1.5 md:right-auto md:bottom-[8svh] md:left-[6vw] md:w-[min(44vw,40rem)]">
          {steps.map((s, i) => (
            <span key={s.title} className="relative block h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/12">
              <span
                ref={(el) => {
                  if (el) tickRefs.current[i] = el;
                }}
                className="absolute inset-0 origin-left bg-gold"
                style={{transform: 'scaleX(0)'}}
              />
            </span>
          ))}
        </div>

        <Shards shards={BITS} store={bits} />
      </div>
    </section>
  );
}

/** What stays the same at every step. */
function Assurances() {
  return (
    <section className="relative bg-ink px-5 py-[14svh] md:px-10" aria-labelledby="promise-title">
      <div className="mx-auto max-w-[80rem]">
        <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
          <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
          {promise.eyebrow}
        </p>
        <h2 id="promise-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">{promise.title}</span>
          </span>
          <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
            <span className="accent fill-gold text-[1.1em] leading-[0.95] md:pl-[1.4em]">{promise.accent}</span>
          </span>
        </h2>
        <dl className="mt-[8svh] grid gap-px overflow-hidden rounded-[24px] border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
          {promise.items.map((it, i) => (
            <div key={it.k} className="bg-coal p-8 md:p-10" data-reveal style={delay(i * 100)}>
              <dt className="accent text-[1.7rem] leading-tight text-ivory">{it.k}</dt>
              <dd className="mt-4 text-body text-linen">{it.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

mount(
  <>
    <PageHero {...processPage} />
    <Steps />
    <Assurances />
    <CtaBand />
  </>,
);
