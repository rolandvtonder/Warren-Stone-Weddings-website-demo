import {useEffect, useRef} from 'react';
import {cta} from '../content';
import {passProgress} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';
import {Pill} from './Pill';
import {Shards, driveShards, useShardRefs, type Shard} from './Shards';
import {u} from '../lib/url';

/**
 * The closing invitation on every inner page: a big caps line answered by
 * a gold italic, petals drifting past at their own depths as it scrolls by.
 */
const BITS: Shard[] = [
  {piece: 'f01', x: 8, y: 30, h: 11, depth: 0.5, rot: 20, spin: 60},
  {piece: 'f11', x: 88, y: 22, h: 7, depth: 0.3, rot: -30, spin: -80},
  {piece: 'f06', x: 80, y: 78, h: 14, depth: 0.6, rot: 40, spin: 50},
  {piece: 'f13', x: 18, y: 82, h: 6, depth: 0.25, rot: 10, spin: 90},
  {piece: 'f04', x: 96, y: 54, h: 26, depth: 0.9, rot: -20, spin: 30, blur: true},
];

export function CtaBand({title = cta.title, accent = cta.accent, body = cta.body}: {title?: string; accent?: string; body?: string}) {
  const rootRef = useRef<HTMLElement>(null);
  const bits = useShardRefs();

  useEffect(
    () =>
      onFrame((time) => {
        const root = rootRef.current;
        if (!root) return;
        const {p, rect, vh} = passProgress(root);
        if (rect.bottom < 0 || rect.top > vh) return;
        const t = time / 1000;
        driveShards(bits, BITS, (s, i) => ({
          x: pointer.x * (s.depth - 0.3) * 4 + Math.cos(t * 0.4 + i) * 0.4,
          y: (0.5 - p) * s.depth * 60 + Math.sin(t * 0.6 + i * 2) * 0.8,
          r: s.rot + p * s.spin,
          s: 1,
          o: 1,
        }));
      }),
    [bits],
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-[18svh]" aria-labelledby="cta-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,rgb(154_116_66_/_0.32),transparent_70%)]" />
      <Shards shards={BITS} store={bits} />
      <div className="relative mx-auto flex max-w-[72rem] flex-col items-center px-5 text-center">
        <p className="eyebrow flex items-center gap-4 text-gold" data-reveal>
          <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
          Complimentary consultation
          <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
        </p>
        <h2 id="cta-title" className="caps mt-8 text-display" style={{fontVariationSettings: '"wght" 820'}}>
          <span className="mask-line" data-reveal="rise">
            <span className="fill-ivory">{title}</span>
          </span>
          <span className="mask-line mask-italic pb-[0.12em]" data-reveal="rise" style={delay(120)}>
            <span className="accent fill-gold text-[1.15em] leading-[0.95]">{accent}</span>
          </span>
        </h2>
        <p className="mt-8 max-w-[30rem] text-body text-linen" data-reveal style={delay(240)}>
          {body}
        </p>
        <div className="mt-10" data-reveal style={delay(320)}>
          <Pill href={u('/contact/')} tone="gold">
            {cta.button}
          </Pill>
        </div>
      </div>
    </section>
  );
}
