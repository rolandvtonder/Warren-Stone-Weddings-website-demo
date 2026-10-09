import {useEffect, useRef, type RefObject} from 'react';
import {mount} from '../boot';
import {CtaBand} from '../components/CtaBand';
import {Marquee} from '../components/Marquee';
import {PageHero} from '../components/PageHero';
import {aboutPage, faqs, founder, pillars, team} from '../content';
import {lerp, passProgress} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';
import {u} from '../lib/url';

/** Photos tagged `data-drift` pan gently against the scroll inside their frames. */
function useDrift(ref: RefObject<HTMLElement | null>, amount = 10) {
  useEffect(
    () =>
      onFrame(() => {
        const root = ref.current;
        if (!root) return;
        const {p, rect, vh} = passProgress(root);
        if (rect.bottom < 0 || rect.top > vh) return;
        root.querySelectorAll<HTMLElement>('[data-drift]').forEach((img) => {
          img.style.transform = `translate3d(0, ${lerp(amount / 2, -amount / 2, p).toFixed(2)}%, 0) scale(1.16)`;
        });
      }),
    [ref, amount],
  );
}

function Founder() {
  const ref = useRef<HTMLElement>(null);
  useDrift(ref);
  return (
    <section ref={ref} className="relative bg-ink px-5 py-[14svh] md:px-10" aria-labelledby="founder-title">
      <div className="mx-auto grid max-w-[80rem] items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div className="relative mx-auto w-full max-w-[30rem]">
          <div aria-hidden="true" className="arch absolute -inset-[14px] bottom-0 border border-b-0 border-gold/50" />
          <div className="arch relative aspect-[3/4] overflow-hidden bg-coal" data-reveal="unveil">
            <img
              data-drift
              src={founder.img}
              srcSet={`${founder.img.replace('.webp', '-m.webp')} 800w, ${founder.img} 1600w`}
              sizes="(max-width: 767px) 90vw, 36vw"
              alt={founder.alt}
              loading="lazy"
              className="size-full object-cover object-top will-change-transform"
            />
          </div>
        </div>
        <div>
          <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            {founder.eyebrow}
          </p>
          <h2 id="founder-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="mask-line" data-reveal="rise">
              <span className="fill-ivory">Chelsea</span>
            </span>
            <span className="mask-line" data-reveal="rise" style={delay(100)}>
              <span className="fill-ivory">Warren-Stone</span>
            </span>
          </h2>
          <p className="accent mt-8 text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight text-gold" data-reveal style={delay(160)}>
            {founder.quote}
          </p>
          {founder.body.map((para, i) => (
            <p key={i} className="mt-6 max-w-[36rem] text-body text-linen" data-reveal style={delay(220 + i * 80)}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const ref = useRef<HTMLElement>(null);
  useDrift(ref, 8);
  return (
    <section ref={ref} className="relative bg-ink px-5 pb-[14svh] md:px-10" aria-labelledby="team-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-coal sm:aspect-[16/9]" data-reveal="unveil">
          <img
            data-drift
            src={u('/media/team.webp')}
            srcSet={u('/media/team-m.webp 800w, /media/team.webp 1600w')}
            sizes="(max-width: 1280px) 92vw, 80rem"
            alt="The Warren-Stone Weddings team, dressed in black, seated together in a bright studio."
            loading="lazy"
            className="size-full object-cover will-change-transform"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
          <p className="eyebrow absolute bottom-6 left-6 text-ivory md:bottom-10 md:left-10">{team.eyebrow}</p>
        </div>
        <div className="mt-[8svh] grid gap-10 md:grid-cols-2">
          <h2 id="team-title" className="caps text-display" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="mask-line" data-reveal="rise">
              <span className="fill-ivory">{team.title}</span>
            </span>
            <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
              <span className="accent fill-gold text-[1.05em] leading-[0.95]">{team.accent}</span>
            </span>
          </h2>
          <p className="self-end text-lead text-linen" data-reveal style={delay(200)}>
            {team.body}
          </p>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="relative bg-ink px-5 py-[12svh] md:px-10" aria-labelledby="pillars-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_20%,rgb(154_116_66_/_0.16),transparent_70%)]" />
      <div className="relative mx-auto max-w-[80rem]">
        <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
          <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
          Why WW
        </p>
        <h2 id="pillars-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">How we</span>
          </span>
          <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
            <span className="accent fill-gold text-[1.1em] leading-[0.95] md:pl-[1.2em]">work.</span>
          </span>
        </h2>
        <div className="mt-[8svh] grid gap-px overflow-hidden rounded-[24px] border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} className="group bg-coal p-8 transition-colors duration-700 hover:bg-soot md:p-10" data-reveal style={delay((i % 3) * 100)}>
              <span className="label text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="accent mt-4 text-[1.9rem] leading-tight text-ivory">{p.title}</h3>
              <ul className="mt-6 flex flex-col gap-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-[0.98rem] text-linen">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold/80" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="relative bg-ink px-5 py-[12svh] md:px-10" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            FAQ
          </p>
          <h2 id="faq-title" className="caps mt-6 text-display" style={{fontVariationSettings: '"wght" 820'}}>
            <span className="mask-line" data-reveal="rise">
              <span className="fill-ivory">Good</span>
            </span>
            <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
              <span className="accent fill-gold text-[1.1em] leading-[0.95]">questions.</span>
            </span>
          </h2>
        </div>
        <div className="border-t border-ivory/12">
          {faqs.map((f, i) => (
            <details key={f.q} className="group border-b border-ivory/12" data-reveal style={delay(i * 60)}>
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 text-left">
                <span className="accent text-[clamp(1.35rem,2vw,1.7rem)] leading-snug text-ivory transition-colors group-hover:text-gold">{f.q}</span>
                <span aria-hidden="true" className="plus grid size-10 shrink-0 place-items-center rounded-full border border-ivory/20 text-[1.2rem] text-gold transition-transform duration-500">
                  +
                </span>
              </summary>
              <p className="max-w-[40rem] pb-6 text-body text-linen">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

mount(
  <>
    <PageHero {...aboutPage} />
    <Founder />
    <Team />
    <Marquee text="Calm · Discreet · Detailed · Trusted · " />
    <Pillars />
    <Faq />
    <CtaBand />
  </>,
);
