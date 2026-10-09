import {useEffect, useRef} from 'react';
import {mount} from '../boot';
import {CtaBand} from '../components/CtaBand';
import {Marquee} from '../components/Marquee';
import {PageHero} from '../components/PageHero';
import {Pill} from '../components/Pill';
import {ceremonies, packages, servicesPage} from '../content';
import {clamp, easeOutCubic, passProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';
import {u} from '../lib/url';

/**
 * The packages as a deck of cards. The cards are sticky siblings in one
 * column, so each pins near the top of the screen and the next slides up
 * over it; the one beneath settles back —
 * a touch smaller, a touch darker — like invitations laid on a table.
 */
function Packages() {
  const wrapRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const shadeRefs = useRef<HTMLDivElement[]>([]);
  const imgRefs = useRef<HTMLImageElement[]>([]);

  useEffect(
    () =>
      onFrame(() => {
        const vh = window.innerHeight;
        const top = vh * 0.1;
        wrapRefs.current.forEach((wrap, i) => {
          const card = cardRefs.current[i];
          const next = wrapRefs.current[i + 1];
          let k = 0;
          if (next) {
            const t = next.getBoundingClientRect().top;
            k = clamp(1 - (t - top) / (vh - top));
          }
          const e = easeOutCubic(k);
          card.style.transform = `translate3d(0, ${-e * 3}vh, 0) scale(${1 - e * 0.07})`;
          shadeRefs.current[i].style.opacity = String(e * 0.7);
          // The photo drifts inside its arch as the card passes.
          const {p} = passProgress(wrap);
          imgRefs.current[i].style.transform = `translate3d(0, ${(0.5 - p) * 8}%, 0) scale(1.12)`;
        });
      }),
    [],
  );

  return (
    <section id="packages" className="relative bg-ink px-4 pb-[12svh] md:px-10" aria-labelledby="packages-title">
      <div className="mx-auto flex max-w-[80rem] flex-wrap items-end justify-between gap-6 pt-[10svh] pb-[6svh]">
        <h2 id="packages-title" className="caps text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">Our packages</span>
          </span>
        </h2>
        <p className="max-w-[26rem] text-body text-linen" data-reveal>
          Premium wedding coordination, planning and on-the-day services that cater to the unique needs of every couple — in Cape Town, South Africa and abroad.
        </p>
      </div>

      <div className="mx-auto max-w-[80rem]">
        {packages.map((pkg, i) => (
          <div
            key={pkg.no}
            ref={(el) => {
              if (el) wrapRefs.current[i] = el;
            }}
            className="relative mb-6 md:sticky md:top-[10svh] md:mb-[14svh] md:h-[80svh]"
            style={{zIndex: i + 1}}
          >
            <div
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="relative origin-top overflow-hidden rounded-[28px] border border-ivory/10 bg-coal shadow-[0_-30px_80px_-30px_rgb(0_0_0_/_0.9)] will-change-transform md:h-full"
            >
              <div className="grid h-full md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative p-4 md:p-6">
                  <div className="arch relative h-[42svh] overflow-hidden md:h-full">
                    <img
                      ref={(el) => {
                        if (el) imgRefs.current[i] = el;
                      }}
                      src={pkg.img}
                      srcSet={`${pkg.img.replace('.webp', '-m.webp')} 800w, ${pkg.img} 1600w`}
                      sizes="(max-width: 767px) 92vw, 40vw"
                      alt={pkg.alt}
                      loading="lazy"
                      className="size-full object-cover will-change-transform"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-8 px-6 pt-2 pb-8 md:py-12 md:pr-12 md:pl-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="label text-gold">Package {pkg.no}</span>
                    <span className="accent text-[1.1rem] text-linen">{pkg.tag}</span>
                  </div>
                  <div>
                    <h3 className="caps text-[clamp(3rem,7vw,7rem)] leading-[0.84]" style={{fontVariationSettings: '"wght" 820'}}>
                      <span className="fill-ivory block">{pkg.name}</span>
                      <span className="accent block text-[0.62em] leading-[1.05] text-gold">{pkg.accent}</span>
                    </h3>
                    <p className="mt-6 max-w-[34rem] text-body text-linen">{pkg.body}</p>
                  </div>
                  <div>
                    <ul className="grid grid-cols-2 gap-x-6 border-t border-ivory/12">
                      {pkg.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-3 border-b border-ivory/12 py-3 text-[0.95rem] text-ivory">
                          <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      <Pill href={u('/contact/')} size="sm">
                        Enquire about {pkg.name.toLowerCase()}
                      </Pill>
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={(el) => {
                  if (el) shadeRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-ink opacity-0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Every kind of ceremony, and the celebration days around it. */
function Ceremonies() {
  const lineRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(
    () =>
      onFrame(() => {
        const root = rootRef.current;
        const line = lineRef.current;
        if (!root || !line) return;
        const {p} = passProgress(root);
        line.style.transform = `scaleX(${easeOutCubic(range(p, 0.35, 0.7))})`;
      }),
    [],
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink px-5 py-[14svh] md:px-10" aria-labelledby="ceremonies-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_15%_30%,rgb(154_116_66_/_0.18),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[80rem] gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            {ceremonies.eyebrow}
          </p>
          <h2 id="ceremonies-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="mask-line" data-reveal="rise">
              <span className="fill-ivory">{ceremonies.title}</span>
            </span>
            <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
              <span className="accent fill-gold text-[1.05em] leading-[0.95]">{ceremonies.accent}</span>
            </span>
          </h2>
          <p className="mt-8 max-w-[28rem] text-body text-linen" data-reveal style={delay(200)}>
            {ceremonies.body}
          </p>
        </div>
        <ul className="self-end border-t border-ivory/12">
          {ceremonies.list.map((c, i) => (
            <li key={c} className="flex items-baseline justify-between border-b border-ivory/12 py-4" data-reveal style={delay(i * 60)}>
              <span className="caps text-[clamp(1.9rem,3.4vw,3.2rem)] leading-none text-ivory" style={{fontVariationSettings: '"wght" 700'}}>
                {c}
              </span>
              <span className="label tabular text-gold">{String(i + 1).padStart(2, '0')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* More than one day: a hairline timeline of the celebration */}
      <div className="relative mx-auto mt-[12svh] max-w-[80rem]">
        <p className="accent text-[clamp(1.8rem,3vw,2.6rem)] text-ivory" data-reveal>
          {ceremonies.extrasTitle}
        </p>
        <div className="relative mt-10">
          <span aria-hidden="true" className="absolute top-[7px] right-0 left-0 h-px bg-ivory/12 max-md:hidden" />
          <span ref={lineRef} aria-hidden="true" className="absolute top-[7px] right-0 left-0 h-px origin-left bg-gold max-md:hidden" style={{transform: 'scaleX(0)'}} />
          <ol className="grid grid-cols-2 gap-y-8 md:grid-cols-6">
            {ceremonies.extras.map((x, i) => (
              <li key={x} className="relative pr-4" data-reveal style={delay(300 + i * 90)}>
                <span aria-hidden="true" className="block size-[15px] rounded-full border border-gold bg-ink">
                  <span className="m-[4px] block size-[5px] rounded-full bg-gold" />
                </span>
                <span className="label mt-4 block text-ash">Moment {String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 block text-[1.05rem] text-ivory">{x}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

mount(
  <>
    <PageHero {...servicesPage} />
    <Packages />
    <Marquee text="Premium · Complete · On the day · Private events · " />
    <Ceremonies />
    <CtaBand />
  </>,
);
