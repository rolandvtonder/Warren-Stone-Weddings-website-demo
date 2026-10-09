import {useEffect, useRef} from 'react';
import {Shards, driveShards, useShardRefs, type Shard} from '../components/Shards';
import {finale, manifesto} from '../content';
import {useFitText} from '../hooks/useFitText';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {u} from '../lib/url';

/**
 * Why Warren-Stone → Leave it to us, as ONE pinned stage so there is no
 * dead scroll between them:
 *
 *   0.00 – 0.36  the paragraph lights word by word; accent words turn gold
 *   0.33 – 0.44  it lifts away and blurs out…
 *   0.35 – 0.56  …while LEAVE IT TO US rises edge to edge, letter by letter
 *   0.42 – 0.76  the first dance rises through the letters, edges dissolving
 *   0.74 – 0.86  the call to action lands at the foot of the frame
 *
 * The outlined twin of the title rides in front of the photo so the covered
 * letters still read. Petals hang in the dark and cross the lens.
 */

const BITS: Shard[] = [
  {piece: 'f06', x: 10, y: 22, h: 12, depth: 0.5, rot: 20, spin: 50},
  {piece: 'f01', x: 88, y: 78, h: 11, depth: 0.55, rot: -20, spin: -40},
  {piece: 'f13', x: 80, y: 16, h: 5, depth: 0.25, rot: 0, spin: 90},
  {piece: 'f10', x: 20, y: 84, h: 5, depth: 0.2, rot: 30, spin: -70},
];

const LENS: Shard[] = [
  {piece: 'f08', x: 8, y: 30, h: 28, depth: 0.9, rot: -24, spin: 30, blur: true},
  {piece: 'f03', x: 92, y: 56, h: 30, depth: 0.95, rot: 30, spin: -25, blur: true},
  {piece: 'f12', x: 70, y: 12, h: 8, depth: 0.55, rot: 10, spin: 70},
  {piece: 'f02', x: 26, y: 70, h: 9, depth: 0.45, rot: 40, spin: -80},
];

function Title({outline, fitRef}: {outline?: boolean; fitRef?: ReturnType<typeof useFitText<HTMLSpanElement>>}) {
  return (
    <span
      ref={fitRef}
      aria-hidden={outline || undefined}
      className={`caps inline-block whitespace-nowrap leading-[0.8] ${
        outline ? 'text-transparent [-webkit-text-stroke:1px_rgb(244_239_230_/_0.7)]' : 'text-ivory'
      }`}
      style={{fontVariationSettings: '"wght" 880'}}
    >
      {Array.from(finale.title).map((ch, i) => (
        <span key={i} className="mask-inline">
          <span data-ch className="inline-block whitespace-pre will-change-transform" style={{transform: 'translate3d(0,105%,0)'}}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Finale() {
  const rootRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const titleWrapRef = useRef<HTMLHeadingElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const fit = useFitText<HTMLSpanElement>();
  const outlineRef = useRef<HTMLDivElement>(null);
  const bits = useShardRefs();
  const lens = useShardRefs();

  // The outline twin copies the fitted size of the solid title.
  useEffect(() => {
    const src = fit.current;
    const twin = outlineRef.current?.firstElementChild as HTMLElement | null;
    if (!src || !twin) return;
    const sync = () => (twin.style.fontSize = src.style.fontSize);
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(src, {attributes: true, attributeFilter: ['style']});
    return () => mo.disconnect();
  }, [fit]);

  useEffect(() => {
    let lastLit = -1;
    return onFrame((time) => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const t = time / 1000;
      const px = pointer.x;

      // The paragraph lights, then lifts away.
      const words = wordsRef.current!.children;
      const n = words.length;
      const lit = range(p, 0.01, 0.32) * n;
      if (Math.abs(lit - lastLit) > 0.01) {
        lastLit = lit;
        for (let i = 0; i < n; i++) (words[i] as HTMLElement).style.opacity = (0.14 + 0.86 * clamp(lit - i)).toFixed(3);
      }
      const away = easeOutCubic(range(p, 0.33, 0.44));
      const para = paraRef.current!;
      para.style.opacity = String(1 - away);
      para.style.transform = `translate3d(0, ${-away * 14}vh, 0)`;
      para.style.filter = away > 0.01 && away < 0.99 ? `blur(${(away * 10).toFixed(1)}px)` : '';
      para.style.visibility = away > 0.99 ? 'hidden' : 'visible';

      // Letters rise from the floor, left to right, on both copies.
      const tIn = range(p, 0.35, 0.56);
      [titleWrapRef.current!, outlineRef.current!].forEach((wrap) => {
        const letters = wrap.querySelectorAll<HTMLElement>('[data-ch]');
        const count = letters.length;
        letters.forEach((el, i) => {
          const k = easeOutCubic(clamp(tIn * 1.7 - (i / count) * 0.7));
          el.style.transform = `translate3d(0, ${((1 - k) * 105).toFixed(2)}%, 0)`;
        });
        wrap.style.transform = `translate3d(${px * -0.6}vw, ${lerp(0, -3, range(p, 0.5, 1))}vh, 0)`;
      });

      // The first dance rises through the letters.
      const rise = easeOutCubic(range(p, 0.42, 0.76));
      figureRef.current!.style.transform = `translate3d(calc(-50% + ${px * 0.8}vw), ${lerp(62, 0, rise) + Math.sin(t * 0.8) * 0.5}vh, 0) scale(${lerp(0.9, 1, rise)})`;
      figureRef.current!.style.opacity = String(clamp(rise * 1.4));
      glowRef.current!.style.opacity = String(rise * (0.8 + Math.sin(t * 1.1) * 0.12));

      const ctaIn = easeOutCubic(range(p, 0.74, 0.86));
      ctaRef.current!.style.opacity = String(ctaIn);
      ctaRef.current!.style.transform = `translate3d(-50%, ${(1 - ctaIn) * 3}vh, 0)`;
      ctaRef.current!.style.pointerEvents = ctaIn > 0.5 ? 'auto' : 'none';

      const drift = (s: Shard, i: number) => ({
        x: px * (s.depth - 0.3) * 4 + Math.cos(t * 0.4 + i) * 0.4,
        y: (0.5 - p) * s.depth * 50 + Math.sin(t * 0.6 + i * 2) * 0.8,
        r: s.rot + p * s.spin,
        s: 1,
        o: 1,
      });
      driveShards(bits, BITS, drift);
      driveShards(lens, LENS, (s, i) => ({...drift(s, i), o: clamp(range(p, 0.3, 0.45) * 1.2)}));
    });
  }, [bits, lens]);

  const accent = new Set(manifesto.accentWords);

  return (
    <section ref={rootRef} id="why" className="relative h-[420svh] bg-ink" aria-label={finale.title}>
      {/* Anchor for "Leave it to us" links: lands with the photo mid-rise. */}
      <span id="leave-it-to-us" aria-hidden="true" className="absolute top-[240svh]" />
      <div className="sticky top-0 h-screen-s overflow-hidden">
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute bottom-[-30%] left-1/2 size-[110vmax] -translate-x-1/2 rounded-full opacity-0"
          style={{background: 'radial-gradient(closest-side, rgb(201 169 110 / 0.36), rgb(154 116 66 / 0.12) 50%, transparent 75%)'}}
        />
        <Shards shards={BITS} store={bits} />

        {/* Why Warren-Stone */}
        <div ref={paraRef} className="absolute inset-0 flex items-center will-change-transform">
          <div className="mx-auto max-w-[78rem] px-5 md:px-10">
            <p className="label text-gold">{manifesto.eyebrow}</p>
            <p ref={wordsRef} className="caps mt-6 text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.94] text-ivory" style={{fontVariationSettings: '"wght" 760'}}>
              {manifesto.words.split(' ').map((w, i) => (
                <span key={i} className={`inline-block pr-[0.22em] opacity-[0.14] ${accent.has(w) ? 'accent text-[1.06em] text-gold' : ''}`}>
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Title behind */}
        {/* The heading itself is the fitted line's parent, so it must be a real box. */}
        <h2 ref={titleWrapRef} className="absolute inset-x-0 top-[34svh] px-3 text-center md:top-[16svh] md:px-5">
          <span className="sr-only">{finale.title}</span>
          <Title fitRef={fit} />
        </h2>

        {/* The first dance, its edges dissolving into the dark */}
        <div
          ref={figureRef}
          className="absolute bottom-0 left-1/2 w-[min(150vw,120svh)] opacity-0 will-change-transform md:w-[min(92vw,118svh)]"
          style={{
            aspectRatio: '3 / 2',
            transform: 'translate3d(-50%, 62vh, 0)',
            maskImage: 'radial-gradient(ellipse 50% 52% at 50% 56%, #000 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 52% at 50% 56%, #000 55%, transparent 100%)',
          }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={u('/media/finale-m.webp')} />
            <img src={u('/media/finale.webp')} alt={finale.photoAlt} loading="lazy" className="size-full object-cover" draggable={false} />
          </picture>
        </div>

        {/* Outline twin in front */}
        <div ref={outlineRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[34svh] px-3 text-center opacity-60 md:top-[16svh] md:px-5">
          <Title outline />
        </div>

        <Shards shards={LENS} store={lens} />

        <div ref={ctaRef} className="absolute bottom-[6svh] left-1/2 flex w-[min(90vw,26rem)] flex-col items-center gap-4 text-center opacity-0" style={{transform: 'translate3d(-50%, 3vh, 0)'}}>
          <a href={u('/contact/')} className="btn-sweep label inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-7 py-4 text-ink transition-colors hover:bg-glow">
            {finale.cta}
            <span aria-hidden="true">→</span>
          </a>
          <p className="label text-linen">{finale.caption}</p>
        </div>
      </div>
    </section>
  );
}
