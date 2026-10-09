/**
 * The confetti: ivory and blush petals and crinkled gold leaf, drawn as
 * vectors and rendered once to WebP. Each file has its soft shadow baked in,
 * and a `-b` twin pre-blurred for the out-of-focus foreground. Both twins
 * share one padded box, so the ratio below holds for either.
 */

import {u} from './url';

export type PieceKind = 'petal' | 'leaf';
export type Piece = {name: string; ratio: number; kind: PieceKind};

export const PIECES: Piece[] = [
  {name: 'f01', ratio: 0.973, kind: 'petal'},
  {name: 'f02', ratio: 0.749, kind: 'petal'},
  {name: 'f03', ratio: 0.976, kind: 'petal'},
  {name: 'f04', ratio: 1.193, kind: 'petal'},
  {name: 'f05', ratio: 1.046, kind: 'petal'},
  {name: 'f06', ratio: 0.615, kind: 'petal'},
  {name: 'f07', ratio: 0.936, kind: 'petal'},
  {name: 'f08', ratio: 1.125, kind: 'petal'},
  {name: 'f09', ratio: 1.127, kind: 'petal'},
  {name: 'f10', ratio: 1.002, kind: 'leaf'},
  {name: 'f11', ratio: 0.862, kind: 'leaf'},
  {name: 'f12', ratio: 0.96, kind: 'leaf'},
  {name: 'f13', ratio: 0.986, kind: 'leaf'},
  {name: 'f14', ratio: 1.144, kind: 'leaf'},
];

export const pieceUrl = (name: string, blurred = false) => u(`/petals/${name}${blurred ? '-b' : ''}.webp`);
