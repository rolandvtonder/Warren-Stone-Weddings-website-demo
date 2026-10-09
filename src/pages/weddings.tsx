import {useEffect, useRef} from 'react';
import {mount} from '../boot';
import {CtaBand} from '../components/CtaBand';
import {Marquee} from '../components/Marquee';
import {PageHero} from '../components/PageHero';
import {couples, gallery, stories, weddingsPage} from '../content';
import {easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';

/**
 * The portfolio as a pinned gallery wall that slides sideways as you
 * scroll down. Every photo also pans inside its own frame, against the
 * direction of travel, so the wall reads as depth rather than a strip.
 */
function GalleryWall() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      onFrame(() => {
        const root = rootRef.current;
        const track = trackRef.current;
        if (!root || !track) return;
        const {p, rect, vh} = pinProgress(root);
        if (rect.bottom < 0 || rect.top > vh) return;
        const vw = window.innerWidth;
        const travel = Math.max(0, track.scrollWidth - vw);
        const x = -travel * p;
        track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
        // Each photo pans against the travel, by where it sits on screen.
        for (const fig of Array.from(track.children) as HTMLElement[]) {
          const img = fig.querySelector('img');
          if (!img) continue;
          const left = fig.offsetLeft + x;
          const c = (left + fig.offsetWidth / 2) / vw - 0.5;
          img.style.transform = `translate3d(${(-c * 8).toFixed(2)}%, 0, 0) scale(1.18)`;
        }
        barRef.current!.style.transform = `scaleX(${p.toFixed(4)})`;
        headRef.current!.style.transform = `translate3d(0, ${-easeOutCubic(range(p, 0.85, 1)) * 4}vh, 0)`;
      }),
    [],
  );

  return (
    <section ref={rootRef} id="portfolio" className="relative h-[420svh] bg-ink" aria-labelledby="portfolio-title">
      <div className="sticky top-0 flex h-screen-s flex-col justify-center overflow-hidden">
        <div ref={headRef} className="flex items-end justify-between gap-6 px-5 pb-[5svh] md:px-10">
          <h2 id="portfolio-title" className="caps text-[clamp(2.6rem,5vw,5rem)] leading-[0.88]" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="fill-ivory">The portfolio</span> <span className="accent fill-gold text-[1.05em]">in pictures.</span>
          </h2>
          <p className="max-w-[24rem] text-[0.98rem] leading-relaxed text-linen max-md:hidden">
            Breathtaking venue designs, exquisite florals and unforgettable moments — every one planned for a couple in their own way.
          </p>
        </div>
        <div ref={trackRef} className="flex w-max items-center gap-4 pl-5 will-change-transform md:gap-6 md:pl-10" style={{paddingRight: '10vw'}}>
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className={`relative shrink-0 overflow-hidden bg-coal ${i % 3 === 1 ? 'arch' : 'rounded-[20px]'}`}
              style={{height: g.h > g.w ? 'min(60svh, 120vw)' : 'min(48svh, 70vw)', aspectRatio: `${g.w} / ${g.h}`}}
            >
              <img
                src={`${g.src}-m.webp`}
                srcSet={`${g.src}-m.webp 700w, ${g.src}.webp 1400w`}
                sizes="(max-width: 767px) 80vw, 45vw"
                alt={g.alt}
                loading="lazy"
                className="size-full object-cover will-change-transform"
              />
            </figure>
          ))}
        </div>
        <div aria-hidden="true" className="mx-5 mt-[5svh] h-px bg-ivory/12 md:mx-10">
          <span ref={barRef} className="block h-full origin-left bg-gold" style={{transform: 'scaleX(0)'}} />
        </div>
      </div>
    </section>
  );
}

/** Couples' stories, in their own words. */
function Stories() {
  const listRef = useRef<HTMLOListElement>(null);

  // Each arch photo drifts a little against the scroll.
  useEffect(
    () =>
      onFrame(() => {
        const list = listRef.current;
        if (!list) return;
        const vh = window.innerHeight;
        list.querySelectorAll<HTMLImageElement>('[data-drift]').forEach((img) => {
          const r = img.parentElement!.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const c = (r.top + r.height / 2) / vh - 0.5;
          img.style.transform = `translate3d(0, ${lerp(0, -10, c).toFixed(2)}%, 0) scale(1.18)`;
        });
      }),
    [],
  );

  return (
    <section id="stories" className="relative bg-ink px-5 py-[14svh] md:px-10" aria-labelledby="stories-title">
      <div className="mx-auto max-w-[80rem]">
        <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
          <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
          Testimonials
        </p>
        <h2 id="stories-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">In their</span>
          </span>
          <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
            <span className="accent fill-gold text-[1.1em] leading-[0.95] md:pl-[1.2em]">own words.</span>
          </span>
        </h2>

        <ol ref={listRef} className="mt-[10svh] flex flex-col gap-[14svh]">
          {stories.map((s, i) => (
            <li key={s.couple} className={`grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="arch relative mx-auto aspect-[3/4] w-full max-w-[26rem] overflow-hidden bg-coal" data-reveal="unveil">
                <img
                  data-drift
                  src={`${s.img}-m.webp`}
                  srcSet={`${s.img}-m.webp 700w, ${s.img}.webp 1400w`}
                  sizes="(max-width: 767px) 90vw, 30vw"
                  alt={s.alt}
                  loading="lazy"
                  className="size-full object-cover will-change-transform"
                />
              </div>
              <figure>
                <span aria-hidden="true" className="accent block text-[6rem] leading-[0.5] text-gold/70" data-reveal>
                  “
                </span>
                <blockquote className="accent mt-2 text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.15] text-ivory" data-reveal style={delay(100)}>
                  {s.quote}
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2" data-reveal style={delay(180)}>
                  <span className="caps text-[1.9rem] leading-none text-ivory" style={{fontVariationSettings: '"wght" 760'}}>
                    {s.couple}
                  </span>
                  <span className="label text-gold">{s.place}</span>
                </figcaption>
                <details className="group mt-7 max-w-[38rem] border-t border-ivory/12" data-reveal style={delay(240)}>
                  <summary className="flex min-h-12 items-center justify-between gap-4 py-3 text-[0.95rem] font-medium text-linen transition-colors hover:text-gold">
                    Read their story
                    <span aria-hidden="true" className="plus grid size-8 place-items-center rounded-full border border-ivory/20 text-gold transition-transform duration-500">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 text-body text-linen">{s.story}</p>
                </details>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Every couple, drifting past in two bands. */
function CoupleBands() {
  const half = Math.ceil(couples.length / 2);
  const line = (list: string[][]) => list.map(([c, p]) => `${c} — ${p}`).join('  ·  ') + '  ·  ';
  return (
    <section className="relative bg-ink py-[8svh]" aria-labelledby="couples-title">
      <div className="px-5 pb-6 text-center md:px-10">
        <h2 id="couples-title" className="eyebrow text-gold" data-reveal>
          Couples from 15 countries
        </h2>
        <p className="sr-only">{couples.map(([c, p]) => `${c}, ${p}`).join('; ')}.</p>
      </div>
      <Marquee text={line(couples.slice(0, half))} quiet />
      <Marquee text={line(couples.slice(half))} quiet reverse />
    </section>
  );
}

mount(
  <>
    <PageHero {...weddingsPage} />
    <GalleryWall />
    <Stories />
    <CoupleBands />
    <CtaBand title="Your story," accent="next." />
  </>,
);
