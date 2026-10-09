import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {brand, footer, nav} from '../content';
import {useFitText} from '../hooks/useFitText';
import {lockScroll, onFrame, scrollToHash} from '../lib/scroll';
import {delay} from '../lib/style';
import {Pill} from './Pill';
import {u} from '../lib/url';

/** The real Warren-Stone logo: the WW monogram in its ring, a hairline, and the wordmark. */
export function Logo({className = ''}: {className?: string}) {
  return <img src={u('/media/ww-full.png')} alt={brand.short} width={1643} height={284} className={`h-7 w-auto md:h-8 ${className}`} draggable={false} />;
}

/** Just the monogram, for small spaces. */
export function Mark({className = ''}: {className?: string}) {
  return <img src={u('/media/ww-mark.png')} alt="" aria-hidden="true" width={889} height={888} className={className} draggable={false} />;
}

const go = (e: MouseEvent<HTMLAnchorElement>) => {
  const href = e.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;
  e.preventDefault();
  scrollToHash(href);
};

const NUMERALS = ['i', 'ii', 'iii', 'iv'];

/** Which nav item is the current page (trailing slash optional). */
const isCurrent = (href: string) => {
  const here = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  return here === href;
};

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  // Hides while you scroll down, returns the moment you scroll back up.
  useEffect(() => {
    let lastY = window.scrollY;
    let shown = true;
    return onFrame(() => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) < 2) return;
      const show = dy < 0 || y < 80 || openRef.current;
      if (show === shown) return;
      shown = show;
      ref.current!.style.transform = show ? '' : 'translate3d(0, -110%, 0)';
    });
  }, []);

  // The mobile menu: lock the page, focus the first link, Escape closes.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      buttonRef.current?.focus();
    };
  }, [open]);

  // A soft lit pill slides under whichever link you're on.
  const hover = (a: HTMLAnchorElement) => {
    const pill = pillRef.current!;
    pill.style.width = `${a.offsetWidth}px`;
    pill.style.transform = `translate3d(${a.offsetLeft}px, 0, 0)`;
    pill.style.opacity = '1';
  };
  const leave = () => {
    pillRef.current!.style.opacity = '0';
  };

  return (
    <>
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-ivory px-4 py-3 text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header ref={ref} className="fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-(--ease-carve)">
        <div className="absolute inset-0 h-[140%] bg-linear-to-b from-ink/85 via-ink/40 to-transparent" aria-hidden="true" />
        <div className="relative grid grid-cols-[1fr_auto] items-center px-5 py-4 md:py-5 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <a href={u('/')} className="flex min-h-11 items-center justify-self-start" aria-label={`${brand.short} — home`}>
            <Logo />
          </a>

          <nav aria-label="Main" className="max-lg:hidden">
            <ul onMouseLeave={leave} className="smoke relative flex items-center rounded-full p-1.5">
              <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-ivory/10 opacity-0 transition-[transform,width,opacity] duration-500 ease-(--ease-carve)"
              />
              {nav.map((item, i) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href} className="relative">
                    <a
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      onMouseEnter={(e) => hover(e.currentTarget)}
                      onFocus={(e) => hover(e.currentTarget)}
                      className={`flex min-h-11 items-baseline gap-2 rounded-full px-5 py-2.5 text-[0.875rem] font-medium tracking-[0.01em] transition-colors duration-300 hover:text-ivory ${
                        current ? 'text-ivory' : 'text-linen'
                      }`}
                    >
                      <span className="accent text-[1rem] text-gold">{NUMERALS[i]}.</span>
                      {item.label}
                      {current && <span aria-hidden="true" className="ml-0.5 size-1 self-center rounded-full bg-gold" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-5">
            <a href={brand.phoneHref} className="eyebrow flex items-center gap-2.5 text-linen transition-colors hover:text-gold max-xl:hidden">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/70 motion-reduce:animate-none" />
                <span className="relative size-1.5 rounded-full bg-gold" />
              </span>
              {brand.phone}
            </a>
            <Pill href={u('/contact/')} size="sm" className="max-sm:hidden">
              Enquire
            </Pill>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
              className="smoke relative grid size-12 place-items-center rounded-full lg:hidden"
            >
              <span aria-hidden="true" className={`absolute h-px w-5 bg-ivory transition-transform duration-500 ease-(--ease-carve) ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span aria-hidden="true" className={`absolute h-px w-5 bg-ivory transition-transform duration-500 ease-(--ease-carve) ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-5 pt-28 pb-10 lg:hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_100%,rgb(154_116_66_/_0.3),transparent_70%)]" />
          <nav aria-label="Mobile" className="relative">
            <ul className="flex flex-col gap-2">
              {[{label: 'Home', href: u('/')}, ...nav, {label: 'Enquire', href: u('/contact/')}].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <a
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className="caps flex items-baseline gap-4 py-1 text-[clamp(3rem,13vw,5rem)] leading-[0.95] text-ivory animate-[menu-in_0.8s_var(--ease-carve)_both] aria-[current=page]:text-gold"
                    style={{fontVariationSettings: '"wght" 760', animationDelay: `${i * 60}ms`}}
                  >
                    <span className="accent text-[0.4em] text-gold">{i === 0 ? '—' : `${['i', 'ii', 'iii', 'iv', 'v'][i - 1]}.`}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="relative mt-10 flex flex-col gap-3 border-t border-ivory/12 pt-6">
            <a href={brand.phoneHref} className="label text-linen">{brand.phone}</a>
            <a href={`mailto:${brand.email}`} className="label text-linen">{brand.email}</a>
            <div className="label flex gap-6 text-gold">
              <a href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={brand.facebook} target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const fit = useFitText<HTMLSpanElement>();
  return (
    <footer id="contact-details" className="relative overflow-hidden bg-ink pt-10 pb-8">
      <div className="px-5 md:px-10">
        <div className="grid gap-10 border-t border-ivory/12 pt-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="max-w-[28rem]" data-reveal>
            <Mark className="size-14 opacity-90" />
            <p className="accent mt-6 text-[2rem] leading-tight text-ivory">{footer.quote}</p>
          </div>
          <div data-reveal style={delay(120)}>
            <p className="eyebrow text-gold">Visit & call</p>
            <ul className="mt-5 flex flex-col gap-3 text-[1rem] text-linen">
              <li>{brand.address}</li>
              <li>
                <a href={brand.phoneHref} className="transition-colors hover:text-gold">{brand.phone}</a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`} className="break-all transition-colors hover:text-gold">{brand.email}</a>
              </li>
            </ul>
          </div>
          <div data-reveal style={delay(240)}>
            <p className="eyebrow text-gold">Explore</p>
            <ul className="label mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-linen">
              {[{label: 'Home', href: u('/')}, ...nav, {label: 'Enquire', href: u('/contact/')}].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 transition-colors hover:text-gold">{l.label}</a>
                </li>
              ))}
              <li>
                <a href={brand.instagram} target="_blank" rel="noreferrer" className="inline-block py-1 transition-colors hover:text-gold">Instagram ↗</a>
              </li>
              <li>
                <a href={brand.facebook} target="_blank" rel="noreferrer" className="inline-block py-1 transition-colors hover:text-gold">Facebook ↗</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-[8svh] overflow-hidden text-center" data-reveal="rise">
          <span>
            <span
              ref={fit}
              className="caps inline-block whitespace-nowrap leading-[0.78] text-ivory"
              style={{fontVariationSettings: '"wght" 900'}}
            >
              {brand.name}
            </span>
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="label max-w-[44rem] leading-relaxed text-ash">{footer.note}</p>
          <a href="#top" onClick={go} className="label inline-block py-2 text-linen transition-colors hover:text-gold">
            Back to the top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
