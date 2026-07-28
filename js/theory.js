/* =====================================================================
   theory.js — the music engine.
   Pure functions, no DOM: keys, diatonic chords, circle distance,
   the harmonic options menu (where a brand CAN go from its key),
   and the two-movement journey compressor (how it gets there —
   never more than a bridge, a turn, and an arrival).
   ===================================================================== */

import { ARCHETYPES } from './data.js';

/* semitone of each key's tonic, in circle order (index ↔ ARCHETYPES) */
export const TONIC_SEMITONE = { C: 0, G: 7, D: 2, A: 9, E: 4, B: 11, 'F#': 6, Db: 1, Ab: 8, Eb: 3, Bb: 10, F: 5 };

/* signed accidental count: sharps positive, flats negative — the
   "physics" the visual direction is derived from (energy vs warmth) */
export const ACCIDENTALS = { C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, Db: -5, Ab: -4, Eb: -3, Bb: -2, F: -1 };

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db']);

export const pretty = (name) => name.replace('#', '♯').replace('b', '♭');

function noteName(semitone, key) {
  const pc = ((semitone % 12) + 12) % 12;
  if (key === 'F#' && pc === 5) return 'E#'; // proper leading-tone spelling
  return (FLAT_KEYS.has(key) ? FLAT_NAMES : SHARP_NAMES)[pc];
}

/* major scale + diatonic triad qualities */
const SCALE = [0, 2, 4, 5, 7, 9, 11];
const QUALITY = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const ROMAN   = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const TRIAD = { maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6] };

export const keyOf = (idx) => ARCHETYPES[((idx % 12) + 12) % 12].key;
export const wrap = (i) => ((i % 12) + 12) % 12;

/* distance on the circle of fifths: 0..6 */
export function circleDistance(i, j) {
  const d = Math.abs(wrap(i) - wrap(j));
  return Math.min(d, 12 - d);
}

/* a chord object the UI and audio both understand */
export function chord(keyIdx, degree, { seventh = false, maj7 = false, minorTonic = false } = {}) {
  const key = keyOf(keyIdx);
  const tonic = TONIC_SEMITONE[key];
  const root = tonic + SCALE[degree];
  let quality = QUALITY[degree];
  let intervals = TRIAD[quality].slice();
  let suffix = quality === 'min' ? 'm' : quality === 'dim' ? '°' : '';
  let roman = ROMAN[degree];
  if (minorTonic && degree === 0) { quality = 'min'; intervals = TRIAD.min.slice(); suffix = 'm'; roman = 'i'; }
  if (maj7) { intervals = intervals.concat([11]); suffix += 'maj7'; roman += 'maj7'; }
  else if (seventh) {
    intervals = degree === 4 ? [0, 4, 7, 10] : intervals.concat([10]);
    suffix += '7';
    roman += '7';
  }
  return {
    keyIdx: wrap(keyIdx), key, degree,
    label: pretty(noteName(root, key)) + suffix,
    roman,
    rootSemitone: ((root % 12) + 12) % 12,
    intervals,
  };
}

/* the tritone substitute: the ♭II7 — jazz's "wrong" dominant that's
   secretly right (it shares the tritone with the real V7) */
export function subV(keyIdx) {
  const key = keyOf(keyIdx);
  const root = TONIC_SEMITONE[key] + 1;
  return {
    keyIdx: wrap(keyIdx), key, degree: -1,
    label: pretty(noteName(root, key)) + '7',
    roman: '♭II7',
    rootSemitone: ((root % 12) + 12) % 12,
    intervals: [0, 4, 7, 10],
  };
}

/* --------------------------------------------------------------------
   Genre routes: three styles of repositioning, three destinations.
   Classical — the better neighbor (±1), moved without a seam.
   Jazz — the tritone (+6): tension held on purpose.
   Pop — the audience's own key (or the +2 gear-shift when you're
   already standing on it): go where the room is.
   ------------------------------------------------------------------- */
export function genreDests(identityIdx, audienceIdx, imageIdx) {
  const neighbor = (d) => {
    const dest = wrap(identityIdx + d);
    return { dest, score: circleDistance(dest, audienceIdx) * 1.2 + circleDistance(dest, imageIdx) };
  };
  const up = neighbor(+1), down = neighbor(-1);
  const classical = up.score <= down.score ? up.dest : down.dest;
  const jazz = wrap(identityIdx + 6);
  const pop = wrap(audienceIdx) === wrap(identityIdx) ? wrap(identityIdx + 2) : wrap(audienceIdx);
  return { classical, jazz, pop, popIsGearShift: wrap(audienceIdx) === wrap(identityIdx) };
}

/* signature chord of an archetype (its "position card" sound) */
export function signatureChord(idx, mode = 'major') {
  const a = ARCHETYPES[wrap(idx)];
  const tonic = TONIC_SEMITONE[a.key];
  let intervals = a.chord.notes.slice();
  if (mode === 'minor') intervals = intervals.map((n) => { const pc = ((n % 12) + 12) % 12; return pc === 4 ? n - 1 : n; });
  return {
    keyIdx: wrap(idx), key: a.key,
    label: pretty(a.key) + (mode === 'minor' ? 'm' : a.chord.suffix),
    roman: mode === 'minor' ? 'i' : 'I',
    rootSemitone: tonic, intervals,
    gloss: a.chord.gloss,
  };
}

export function rootMidi(keyIdx) {
  const t = TONIC_SEMITONE[keyOf(keyIdx)];
  return 48 + (t > 7 ? t - 12 : t);
}

/* --------------------------------------------------------------------
   The options menu: the five movements available from any key.
   Hold (0) · Sharpen (+1, dominant) · Warm (−1, subdominant) ·
   Recompose (+3, the relative door — shared key signature) ·
   Invert (+6, the tritone — the semiotic contrary).
   Each option carries its diagnostics: reach (effort from identity),
   earshot (distance to the audience), belief (distance from image).
   ------------------------------------------------------------------- */
export const MOVE_DEFS = [
  { id: 'hold',        title: 'Hold',      mechanic: 'deepen in place',        delta: 0 },
  { id: 'dominant',    title: 'Sharpen',   mechanic: 'the dominant move · one fifth up',  delta: +1 },
  { id: 'subdominant', title: 'Warm',      mechanic: 'the subdominant move · one fifth down', delta: -1 },
  { id: 'relative',    title: 'Recompose', mechanic: 'the relative door · same signature, new center', delta: +3 },
  { id: 'tritone',     title: 'Invert',    mechanic: 'the tritone · become the contrary', delta: +6 },
];

export function futureMoves(identityIdx, audienceIdx, imageIdx) {
  return MOVE_DEFS.map((d) => {
    const destIdx = wrap(identityIdx + d.delta);
    return {
      ...d, destIdx,
      reach: circleDistance(identityIdx, destIdx),
      earshot: circleDistance(destIdx, audienceIdx),
      belief: circleDistance(destIdx, imageIdx),
    };
  });
}

/* --------------------------------------------------------------------
   Journey compression: never more than two movements.
   d ≤ 2  → one direct movement (a legible pivot move).
   d ≥ 3  → Movement I bridges to an intermediate key (≤ 2 fifths out,
            chosen to pass nearest the audience), then Movement II is
            "the turn": enter the destination through its own ii–V —
            the target's grammar adopted before its name is claimed.
   The final landing chord is left to the cadence.
   ------------------------------------------------------------------- */
function dirOf(a, b) { return wrap(b - a) <= 6 ? 'sharp' : 'flat'; }

export function compressJourney(fromIdx, toIdx, audienceIdx) {
  fromIdx = wrap(fromIdx); toIdx = wrap(toIdx); audienceIdx = wrap(audienceIdx);
  if (fromIdx === toIdx) return { inPlace: true, movements: [] };

  const d = circleDistance(fromIdx, toIdx);
  if (d <= 2) {
    return { inPlace: false, movements: [{ type: 'direct', from: fromIdx, to: toIdx, dir: dirOf(fromIdx, toIdx), dist: d }] };
  }
  // choose the intermediate: within two fifths of home, not the target,
  // nearest the audience; ties break toward the target
  let best = null;
  for (let x = 0; x < 12; x++) {
    if (x === fromIdx || x === toIdx) continue;
    const leg1 = circleDistance(fromIdx, x);
    if (leg1 > 2) continue;
    const cand = { x, leg1, aud: circleDistance(x, audienceIdx), toTarget: circleDistance(x, toIdx) };
    if (!best || cand.aud < best.aud || (cand.aud === best.aud && cand.toTarget < best.toTarget)) best = cand;
  }
  return {
    inPlace: false,
    movements: [
      { type: 'direct', from: fromIdx, to: best.x, dir: dirOf(fromIdx, best.x), dist: best.leg1 },
      { type: 'turn', from: best.x, to: toIdx, dist: circleDistance(best.x, toIdx) },
    ],
  };
}

/* one movement as chords. Direct movements END ON THE NEW DOMINANT
   (arrival is the cadence's job when they are the final movement);
   when a direct movement is Movement I of two, it resolves to its
   local tonic so the bridge key is actually reached.                 */
export function movementChords(m, { resolve }) {
  const out = { chords: [], pivotLabel: '', pivotGloss: '' };
  if (m.type === 'turn') {
    const ii = chord(m.to, 1, { seventh: true });
    const V = chord(m.to, 4, { seventh: true });
    out.chords = [ii, V];
    out.pivotLabel = `${ii.label} → ${V.label}`;
    out.pivotGloss = `${pretty(keyOf(m.to))}’s own ii–V — the destination’s grammar, spoken before its name is claimed.`;
    return out;
  }
  const { from, to, dir, dist } = m;
  if (dir === 'sharp') {
    const pivot = dist === 1 ? chord(from, 5) : chord(from, 2); // vi (=ii of new) or iii (=ii of new, two out)
    const V = chord(to, 4, { seventh: true });
    out.chords = [chord(from, 0), pivot, V];
    out.pivotLabel = pivot.label;
    out.pivotGloss = dist === 1
      ? `${pivot.label} lives in both keys — vi of ${pretty(keyOf(from))}, ii of ${pretty(keyOf(to))}: the shared material the move travels through.`
      : `${pivot.label} is ${pretty(keyOf(from))}’s iii re-heard as ${pretty(keyOf(to))}’s ii — one chord, two allegiances.`;
  } else {
    const pivot = dist === 1 ? chord(from, 0, { seventh: true }) : chord(from, 3, { seventh: dist === 2 });
    out.chords = [chord(from, 0), pivot];
    out.pivotLabel = pivot.label;
    out.pivotGloss = dist === 1
      ? `${pivot.label} is the old home chord with one honest flat added — suddenly the dominant of ${pretty(keyOf(to))}. What you already are becomes the door.`
      : `${pivot.label} is ${pretty(keyOf(from))}’s IV re-voiced as ${pretty(keyOf(to))}’s dominant — owned ground, pointing at the new home.`;
  }
  if (resolve) out.chords.push(chord(to, 0));
  return out;
}

/* the cadence RESOLVES the prepared dominant */
export function cadenceProgression(kind, keyIdx, mode = 'major') {
  const I = chord(keyIdx, 0, { minorTonic: mode === 'minor' });
  if (kind === 'plagal') return [I, chord(keyIdx, 3), I];
  if (kind === 'deceptive') return [chord(keyIdx, 5), chord(keyIdx, 4, { seventh: true }), I];
  return [I]; // authentic: the V7 is already sounding — land
}

export function chooseCadence(imageIdx, destIdx) {
  const d = circleDistance(imageIdx, destIdx);
  if (d <= 1) return 'authentic';
  if (d <= 3) return 'plagal';
  return 'deceptive';
}

/* the whole piece: home → route (in the chosen style) → cadence */
export function fullProgression(study, destIdx, destMode = 'major', via = 'classical') {
  const idIdx = study.identity.index;
  destIdx = wrap(destIdx);
  const cadKind = chooseCadence(study.image.index, destIdx);
  const bars = [];
  bars.push({ chord: signatureChord(idIdx, study.identity.mode), tag: 'home' });

  /* jazz: the target's ii, then the tritone substitute — dissonance held
     on purpose — then resolution (deceptive if belief demands it) */
  if (via === 'jazz' && destIdx !== idIdx) {
    const journey = { inPlace: false, genre: 'jazz', movements: [{ type: 'jazz', from: idIdx, to: destIdx }] };
    bars.push({ chord: chord(destIdx, 1, { seventh: true }), tag: 'turn' });
    bars.push({ chord: subV(destIdx), tag: 'turn', pivot: true });
    if (cadKind === 'deceptive') {
      bars.push({ chord: chord(destIdx, 5), tag: 'cadence' });
      bars.push({ chord: chord(destIdx, 4, { seventh: true }), tag: 'cadence' });
    }
    bars.push({ chord: chord(destIdx, 0, { maj7: true, minorTonic: destMode === 'minor' }), tag: 'cadence' });
    return { journey, cadence: cadKind, bars, destIdx, destMode };
  }

  /* pop: the doo-wop loop in the destination key — I vi IV V —
     ending prepared, then the cadence lands it */
  if (via === 'pop' && destIdx !== idIdx) {
    const journey = { inPlace: false, genre: 'pop', movements: [{ type: 'pop', from: idIdx, to: destIdx }] };
    [chord(destIdx, 0), chord(destIdx, 5), chord(destIdx, 3), chord(destIdx, 4, { seventh: true })]
      .forEach((c) => bars.push({ chord: c, tag: 'turn' }));
    cadenceProgression(cadKind, destIdx, destMode).forEach((c) => bars.push({ chord: c, tag: 'cadence' }));
    return { journey, cadence: cadKind, bars, destIdx, destMode };
  }

  /* classical (and the stated ambition): pivot modulation, by the book */
  const journey = compressJourney(idIdx, destIdx, study.audience.index);
  if (journey.inPlace) {
    [chord(idIdx, 3), chord(idIdx, 4, { seventh: true }), chord(idIdx, 0, { minorTonic: destMode === 'minor' }), chord(idIdx, 3), chord(idIdx, 0)]
      .forEach((c, i) => bars.push({ chord: c, tag: i >= 2 ? 'cadence' : 'deepen' }));
    return { journey, cadence: 'plagal', bars, destIdx, destMode };
  }

  journey.movements.forEach((m, mi) => {
    const isFinal = mi === journey.movements.length - 1;
    const mc = movementChords(m, { resolve: !isFinal }); // final movement stays on V7; cadence lands it
    mc.chords.forEach((c, ci) => {
      if (ci === 0 && bars.length) {
        const prev = bars[bars.length - 1];
        if (prev.chord.rootSemitone === c.rootSemitone && (prev.chord.roman === c.roman || prev.tag === 'home')) return;
      }
      bars.push({ chord: c, tag: mi === 0 && journey.movements.length > 1 ? 'bridge' : 'turn', mvt: mi, pivot: mc.pivotLabel === c.label });
    });
  });

  cadenceProgression(cadKind, destIdx, destMode).forEach((c) => bars.push({ chord: c, tag: 'cadence' }));
  return { journey, cadence: cadKind, bars, destIdx, destMode };
}
