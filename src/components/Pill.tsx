import type {MouseEvent, ReactNode} from 'react';
import {scrollToHash} from '../lib/scroll';

/**
 * The site's button: a pill with the label on the left and an arrow sitting
 * in its own disc on the right. On hover the disc turns the arrow from
 * pointing down/right to pointing onward, and a light sweeps across.
 * In-page hashes glide with Lenis; page paths navigate normally.
 */
export function Pill({
  href,
  children,
  tone = 'solid',
  arrow = 'right',
  size = 'md',
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'solid' | 'glass' | 'gold';
  arrow?: 'right' | 'down';
  size?: 'md' | 'sm';
  className?: string;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    scrollToHash(href);
  };
  const tones = {
    solid: 'bg-ivory text-ink hover:bg-glow',
    gold: 'bg-gold text-ink hover:bg-glow',
    glass: 'smoke text-ivory',
  };
  return (
    <a
      href={href}
      onClick={onClick}
      className={`btn-sweep group inline-flex min-h-11 items-center rounded-full font-medium tracking-[0.02em] transition-colors duration-500 ${
        size === 'sm' ? 'gap-3 py-1 pr-1 pl-5 text-[0.8125rem]' : 'gap-4 py-1.5 pr-1.5 pl-6 text-[0.875rem]'
      } ${tones[tone]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-full ${size === 'sm' ? 'size-9' : 'size-10'} transition-transform duration-700 ease-(--ease-carve) ${
          arrow === 'down' ? 'group-hover:translate-y-0.5' : 'group-hover:-rotate-45'
        } ${tone === 'glass' ? 'bg-ivory text-ink' : 'bg-ink text-ivory'}`}
      >
        <svg viewBox="0 0 16 16" className={`size-3.5 ${arrow === 'down' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
