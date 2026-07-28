/* =====================================================================
   composer.js — from progression to performance.
   Takes the study's bars and a genre, returns a scheduled piece:
   note and drum events in beats, one bar per chord.
   Deterministic per progression (seeded), so a brand's song is stable.
   ===================================================================== */

/* tiny seeded PRNG — the same study always composes the same piece */
function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pcOf = (iv) => ((iv % 12) + 12) % 12;

function anatomy(chord) {
  const tones = [...new Set(chord.intervals.map(pcOf))];
  const third = tones.includes(4) ? 4 : tones.includes(3) ? 3 : 4;
  const seventh = tones.includes(10) ? 10 : tones.includes(11) ? 11 : null;
  return { root: pcOf(chord.rootSemitone), third, fifth: 7, seventh, tones };
}

/* anchored registers */
const bassRoot = (pc) => { let m = 36 + pc; if (m > 44) m -= 12; return m; };   // ~E1–A♭2
const compRoot = (pc) => { let m = 60 + pc; if (m > 66) m -= 12; return m; };   // ~F3–F♯4
const melRoot = (pc) => { let m = 72 + pc; if (m > 78) m -= 12; return m; };    // ~G4–G♭5

/* melodic sets: pentatonic flavor drawn from the chord quality */
const melodySet = (a) => (a.third === 3 ? [0, 3, 5, 7, 10, 12, 15] : [0, 2, 4, 7, 9, 12, 14]);

export function composePiece(bars, genre) {
  const rng = mulberry(bars.reduce((s, b, i) => s + b.chord.rootSemitone * (i + 7), genre.length * 31));
  const events = [];
  const note = (midi, t, dur, level) => events.push({ kind: 'note', midi, t, dur, level });
  const drum = (kind, t, level = 1) => events.push({ kind, t, level });
  const n = bars.length;

  if (genre === 'jazz') {
    const bpm = 126;
    bars.forEach((bar, bi) => {
      const a = anatomy(bar.chord);
      const t0 = bi * 4;
      const last = bi === n - 1;
      const bR = bassRoot(a.root), cR = compRoot(a.root);
      // walking bass: root — color — fifth — chromatic approach to the next root
      const nextRoot = bassRoot(anatomy(bars[(bi + 1) % n].chord).root);
      const walk = last
        ? [bR, bR + a.third, bR + 7, bR]
        : [bR, bR + (rng() > 0.5 ? a.third : 7), bR + (rng() > 0.5 ? 7 : a.third - 12 + 12), nextRoot + (rng() > 0.5 ? -1 : 1)];
      walk.forEach((m, k) => note(m, t0 + k, 0.95, 0.2));
      // comping: rootless voicing (3–7–9), Charleston-ish swung hits
      const voicing = [cR + a.third, cR + (a.seventh ?? 10), cR + 14];
      const hits = last ? [0] : rng() > 0.5 ? [0, 1.66] : [0.66, 2.66];
      hits.forEach((h) => voicing.forEach((m) => note(m, t0 + h, last ? 3.2 : 0.4, 0.16)));
      // ride pattern: ding — ding-a — ding
      [0, 1, 1.66, 2, 3, 3.66].forEach((h) => drum('ride', t0 + h, h % 1 ? 0.6 : 1));
      if (!last) { drum('hat', t0 + 1); drum('hat', t0 + 3); }
    });
  } else if (genre === 'pop') {
    const bpm = 104;
    // one hook, repeated: same rhythm and contour transposed over every chord
    const hookRhythm = [0, 0.5, 1, 2, 2.5];
    const hookDegrees = [4, 2, 1, 2, 0].map((d) => (rng() > 0.7 ? d + 1 : d));
    bars.forEach((bar, bi) => {
      const a = anatomy(bar.chord);
      const t0 = bi * 4;
      const last = bi === n - 1;
      const bR = bassRoot(a.root), cR = compRoot(a.root), mR = melRoot(a.root);
      const set = melodySet(a);
      // drums: kick 1 & 3, snare 2 & 4, hats on 8ths
      drum('kick', t0); drum('kick', t0 + 2);
      if (!last && rng() > 0.6) drum('kick', t0 + 3.5, 0.7);
      drum('snare', t0 + 1); drum('snare', t0 + 3);
      for (let h = 0; h < 8; h++) drum('hat', t0 + h * 0.5, h % 2 ? 0.5 : 0.8);
      // left hand: pumping roots
      for (let h = 0; h < 8; h++) note(bR + (h % 4 === 3 ? 7 : 0), t0 + h * 0.5, 0.5, h % 2 ? 0.1 : 0.15);
      // right hand: chord pump
      const triad = [cR, cR + a.third, cR + 7];
      for (let h = 0; h < 8; h++) triad.forEach((m) => note(m, t0 + h * 0.5, 0.5, h === 0 ? 0.17 : 0.11));
      // the hook
      if (last) { note(mR + 12, t0, 3.4, 0.3); note(mR, t0, 3.4, 0.24); }
      else hookRhythm.forEach((h, k) => note(mR + set[hookDegrees[k] % set.length], t0 + h, k === hookRhythm.length - 1 ? 1.2 : 0.5, 0.26));
    });
    return { events, bpm, beatsPerBar: 4, barCount: n };
  } else {
    // classical: broken-chord accompaniment, voice-led melody
    const bpm = 88;
    let prevMel = null;
    bars.forEach((bar, bi) => {
      const a = anatomy(bar.chord);
      const t0 = bi * 4;
      const last = bi === n - 1;
      const bR = bassRoot(a.root) + 12, mR = melRoot(a.root);
      const set = melodySet(a);
      // left hand: flowing eighths through the chord
      const pat = last ? [0, 7, 12, 12 + a.third] : [0, 7, 12, 7, 12 + a.third, 7, 12, 7];
      pat.forEach((iv, k) => note(bR + iv, t0 + k * 0.5, 0.6, 0.15));
      // melody: nearest-step walk through the chord's set, cadencing on the root
      if (last) { note(mR, t0, 3.6, 0.3); note(mR - 12 + a.third, t0 + 0.02, 3.6, 0.18); }
      else {
        const candidates = set.map((s) => mR + s);
        for (let beat = 0; beat < 4; beat++) {
          let pick;
          if (prevMel == null) pick = mR + set[2];
          else if (beat === 3) pick = candidates.reduce((x, y) => (Math.abs(y - prevMel) < Math.abs(x - prevMel) ? y : x), mR);
          else {
            const near = candidates.filter((c) => Math.abs(c - prevMel) <= 4 && c !== prevMel);
            pick = near.length ? near[Math.floor(rng() * near.length)] : mR + set[Math.floor(rng() * set.length)];
          }
          note(pick, t0 + beat, 0.95, 0.28);
          prevMel = pick;
        }
      }
    });
    return { events, bpm, beatsPerBar: 4, barCount: n };
  }
  return { events, bpm: 126, beatsPerBar: 4, barCount: n };
}
