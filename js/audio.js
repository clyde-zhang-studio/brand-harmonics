/* =====================================================================
   audio.js — a piano on the raw Web Audio API.
   Additive synthesis, struck not plucked: stacked partials with
   per-partial decays, slight inharmonic stretch, and a felt-hammer
   thump, computed once per note into cached buffers.
   No libraries; nothing to install.
   ===================================================================== */

let ctx = null, master = null, dry = null, wet = null;
const active = new Set();   // live sources, for stopAll
let timers = [];            // UI-callback timeouts, for stopAll
const pluckCache = new Map();

function ensureCtx() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  master = ctx.createGain(); master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 22; comp.ratio.value = 3.5;

  // a room for the piano: 2s of exponentially decaying noise as the impulse
  const seconds = 2.0, rate = ctx.sampleRate;
  const ir = ctx.createBuffer(2, seconds * rate, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.4);
  }
  const verb = ctx.createConvolver(); verb.buffer = ir;

  dry = ctx.createGain(); dry.gain.value = 0.85;
  wet = ctx.createGain(); wet.gain.value = 0.22;
  master.connect(dry); dry.connect(comp);
  master.connect(verb); verb.connect(wet); wet.connect(comp);
  comp.connect(ctx.destination);
}

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

/* A struck string, not a plucked one: piano-style additive synthesis.
   Each note is a stack of partials with a hammer-fast attack and
   per-partial decays (high partials die first), a touch of inharmonic
   stretch, and a soft felt thump — computed once into a cached buffer. */
function pluckBuffer(midi) {
  if (pluckCache.has(midi)) return pluckCache.get(midi);
  const sr = ctx.sampleRate;
  const f = midiHz(midi);
  const seconds = 3.4;
  const len = Math.floor(sr * seconds);
  const data = new Float32Array(len);

  // partials: gains fall off, decays shorten as the partial rises;
  // slight stretch (real strings are stiff) keeps it from sounding organ-like
  const PARTIALS = [
    { n: 1, gain: 1.0, decay: 1.15 },
    { n: 2, gain: 0.42, decay: 0.55 },
    { n: 3, gain: 0.2, decay: 0.36 },
    { n: 4, gain: 0.09, decay: 0.25 },
    { n: 5.02, gain: 0.05, decay: 0.18 },
  ];
  const stretch = 1 + 0.0006 * (midi < 52 ? 2 : 1);
  const brightness = midi > 66 ? 0.8 : 1; // upper register a touch gentler
  for (const p of PARTIALS) {
    const w = 2 * Math.PI * f * p.n * Math.pow(stretch, p.n * p.n) / sr;
    const dec = p.decay * (midi < 52 ? 1.5 : 1); // bass rings longer
    const g0 = p.gain * brightness;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      data[i] += g0 * Math.exp(-t / dec) * Math.sin(w * i);
    }
  }
  // hammer thump: a few ms of soft filtered noise at the very front
  let prev = 0;
  const thump = Math.floor(sr * 0.012);
  for (let i = 0; i < thump; i++) {
    const w = Math.random() * 2 - 1;
    prev = 0.6 * prev + 0.4 * w;
    data[i] += prev * 0.25 * (1 - i / thump);
  }
  // fast attack ramp so the strike doesn't click
  const atk = Math.floor(sr * 0.002);
  for (let i = 0; i < atk; i++) data[i] *= i / atk;
  // normalize to a safe peak
  let peak = 0;
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(data[i]));
  const norm = peak > 0 ? 0.95 / peak : 1;
  for (let i = 0; i < len; i++) data[i] *= norm;

  const buf = ctx.createBuffer(1, len, sr);
  buf.copyToChannel(data, 0);
  pluckCache.set(midi, buf);
  return buf;
}

function pluck(midi, t0, dur, level = 0.3) {
  const src = ctx.createBufferSource();
  src.buffer = pluckBuffer(midi);
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(level, t0);
  gn.gain.setValueAtTime(level, t0 + Math.max(0.05, dur));
  gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.5);
  src.connect(gn); gn.connect(master);
  src.start(t0); src.stop(t0 + dur + 0.6);
  active.add(src);
  src.onended = () => active.delete(src);
}

/* a chord: intervals (semitones) above a root midi note */
export function playChord(rootMidi, intervals, { when = 0, duration = 2.6, strum = 0.018, level = 0.28 } = {}) {
  ensureCtx();
  const t0 = ctx.currentTime + 0.02 + when;
  intervals.forEach((iv, i) => pluck(rootMidi + iv, t0 + i * strum, duration, level));
  return duration;
}

/* two keys sounded together — the gap made audible */
export function playPolychord(rootA, ivA, rootB, ivB, { duration = 3.4 } = {}) {
  ensureCtx(); stopAll();
  playChord(rootA, ivA, { duration, level: 0.26, strum: 0.02 });
  playChord(rootB + 12, ivB, { duration, level: 0.2, strum: 0.02, when: 0.02 });
  return duration;
}

/* the four positions as one slow arpeggio — "the sound of the brand now" */
export function playTetrad(rootMidis, { duration = 5.0 } = {}) {
  ensureCtx(); stopAll();
  const sorted = [...rootMidis].sort((a, b) => a - b);
  const spread = sorted.map((m, i) => m + (i >= 2 ? 12 : 0));
  spread.forEach((m, i) => pluck(m, ctx.currentTime + 0.02 + i * 0.09, duration, 0.24));
  return duration;
}

/* a sequence of chords; onStep(i) fires as each begins, onDone() after */
export function playProgression(chords, { secondsPerChord = 1.7, onStep = null, onDone = null } = {}) {
  ensureCtx(); stopAll();
  let t = 0;
  chords.forEach((c, i) => {
    playChord(c.rootMidi, c.intervals, { when: t, duration: secondsPerChord * 1.2, level: 0.26, strum: 0.02 });
    if (onStep) timers.push(setTimeout(() => onStep(i), (t + 0.03) * 1000));
    t += secondsPerChord;
  });
  if (onDone) timers.push(setTimeout(onDone, (t + 0.9) * 1000));
  return t;
}

/* ---- a small drum kit, synthesized ------------------------------- */
let noiseBuf = null;
function noise() {
  if (noiseBuf) return noiseBuf;
  const len = ctx.sampleRate * 0.5;
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

function drumKick(t, level = 1) {
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.11);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5 * level, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + 0.25);
  active.add(o); o.onended = () => active.delete(o);
}

function drumNoise(t, { hp = 6000, dur = 0.045, level = 0.09, body = 0 }) {
  const src = ctx.createBufferSource(); src.buffer = noise();
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(level, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t); src.stop(t + dur + 0.02);
  active.add(src); src.onended = () => active.delete(src);
  if (body) { // snare drum body tone
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = body;
    const og = ctx.createGain();
    og.gain.setValueAtTime(level * 0.9, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(og); og.connect(master);
    o.start(t); o.stop(t + 0.1);
    active.add(o); o.onended = () => active.delete(o);
  }
}

/* ---- perform a composed piece ------------------------------------ */
export function playPiece(piece, { onBar = null, onDone = null } = {}) {
  ensureCtx(); stopAll();
  const spb = 60 / piece.bpm;
  const t0 = ctx.currentTime + 0.06;
  piece.events.forEach((ev) => {
    const t = t0 + ev.t * spb;
    if (ev.kind === 'note') pluck(ev.midi, t, ev.dur * spb, ev.level);
    else if (ev.kind === 'kick') drumKick(t, ev.level ?? 1);
    else if (ev.kind === 'snare') drumNoise(t, { hp: 1600, dur: 0.12, level: 0.12 * (ev.level ?? 1), body: 190 });
    else if (ev.kind === 'hat') drumNoise(t, { hp: 7000, dur: 0.04, level: 0.06 * (ev.level ?? 1) });
    else if (ev.kind === 'ride') drumNoise(t, { hp: 5200, dur: 0.11, level: 0.05 * (ev.level ?? 1) });
  });
  const barSec = piece.beatsPerBar * spb;
  if (onBar) for (let b = 0; b < piece.barCount; b++) timers.push(setTimeout(() => onBar(b), (0.06 + b * barSec) * 1000));
  if (onDone) timers.push(setTimeout(onDone, (0.06 + piece.barCount * barSec + 1.6) * 1000));
  return piece.barCount * barSec;
}

export function stopAll() {
  timers.forEach(clearTimeout); timers = [];
  if (!ctx) return;
  active.forEach((s) => { try { s.stop(); } catch (e) { /* already stopped */ } });
  active.clear();
}
