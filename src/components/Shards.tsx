import {useRef} from 'react';
import {PIECES, pieceUrl} from '../lib/pieces';

/**
 * A field of floating petals and gold leaf. The markup is static; the owning
 * section moves every piece from its own rAF tick with `driveShards`, so
 * nothing re-renders while scrolling.
 *
 * Position is the piece's resting centre in % of the stage, size is its
 * height in vmin, depth runs 0 (far, small, slow) → 1 (in front of the lens,
 * big, blurred, fast).
 */
export type Shard = {
  piece: string;
  x: number;
  y: number;
  h: number;
  depth: number;
  rot: number;
  spin: number;
  blur?: boolean;
};

const ratioOf = (name: string) => PIECES.find((p) => p.name === name)?.ratio ?? 1;

export function useShardRefs() {
  return useRef<HTMLDivElement[]>([]);
}

export function Shards({
  shards,
  store,
  className = '',
}: {
  shards: Shard[];
  store: ReturnType<typeof useShardRefs>;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {shards.map((s, i) => {
        const w = s.h * ratioOf(s.piece);
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) store.current[i] = el;
            }}
            className="absolute will-change-transform"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${w}vmin`,
              height: `${s.h}vmin`,
              marginLeft: `${-w / 2}vmin`,
              marginTop: `${-s.h / 2}vmin`,
            }}
          >
            <img src={pieceUrl(s.piece, s.blur)} alt="" loading="lazy" decoding="async" className="size-full" draggable={false} />
          </div>
        );
      })}
    </div>
  );
}

/** z, when given, sets the piece's stacking order inside the stage. */
export type ShardPose = {x: number; y: number; r: number; s: number; o: number; z?: number};

/** Writes one transform per piece; x in vw, y in vh, r in degrees. */
export function driveShards(
  store: ReturnType<typeof useShardRefs>,
  shards: Shard[],
  pose: (s: Shard, i: number) => ShardPose,
) {
  const els = store.current;
  for (let i = 0; i < shards.length; i++) {
    const el = els[i];
    if (!el) continue;
    const {x, y, r, s, o, z} = pose(shards[i], i);
    if (z !== undefined && el.style.zIndex !== String(z)) el.style.zIndex = String(z);
    el.style.transform = `translate3d(${x.toFixed(3)}vw, ${y.toFixed(3)}vh, 0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    el.style.opacity = o >= 0.999 ? '1' : o.toFixed(3);
  }
}
