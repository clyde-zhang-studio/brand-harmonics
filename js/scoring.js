/* =====================================================================
   scoring.js — from answers to positions.
   Each lens: six axis choices (+ one valence) → a 12-dim archetype
   vector → a dominant archetype (a key), a mode (major/minor), and
   square coordinates (x: which pole it serves, y: how fully it
   asserts). Pure functions; no DOM.
   ===================================================================== */

import { ARCHETYPES, AXES, byId } from './data.js';
import { wrap } from './theory.js';

const N = 12;
const NEIGHBOR_SPILL = 0.35; // kinship: a choice warms its wheel-neighbors

/* answers: { axes: [{side:'a'|'b', strength:1|2} x6], valence:'major'|'minor' } */
export function scoreLens(answers) {
  const vec = new Array(N).fill(0);
  answers.axes.forEach((ans, i) => {
    if (!ans) return;
    const id = ans.side === 'a' ? AXES[i].a : AXES[i].b;
    const idx = byId[id].index;
    vec[idx] += ans.strength;
    vec[wrap(idx - 1)] += ans.strength * NEIGHBOR_SPILL;
    vec[wrap(idx + 1)] += ans.strength * NEIGHBOR_SPILL;
  });

  // dominant: highest total; ties break by direct (unspilled) hits, then wheel order
  const direct = new Array(N).fill(0);
  answers.axes.forEach((ans, i) => {
    if (!ans) return;
    direct[byId[ans.side === 'a' ? AXES[i].a : AXES[i].b].index] += ans.strength;
  });
  let index = 0;
  for (let i = 1; i < N; i++) {
    if (vec[i] > vec[index] + 1e-9 || (Math.abs(vec[i] - vec[index]) < 1e-9 && direct[i] > direct[index])) index = i;
  }

  // assertion: how much of the meaning-mass the dominant key holds.
  // Because the six answers land on six different axes, the share has a
  // structural range of roughly .145 (scattered) to .235 (a dominant
  // pole reinforced by strong neighbors). Rescale that band to 0..1.
  const total = vec.reduce((s, v) => s + v, 0) || 1;
  const share = vec[index] / total;
  const assertion = Math.max(0, Math.min(1, (share - 0.145) / (0.235 - 0.145)));

  return { vector: vec, index, dominantId: ARCHETYPES[index].id, mode: answers.valence || 'major', assertion, direct };
}

/* affinity of a lens vector for one archetype pole (with neighbor warmth) */
function poleAffinity(vec, idx) {
  return vec[idx] + 0.5 * (vec[wrap(idx - 1)] + vec[wrap(idx + 1)]);
}

/* the whole study */
export function runStudy(allAnswers) {
  const lenses = {};
  for (const lensId of ['identity', 'audience', 'image', 'aspiration']) {
    lenses[lensId] = scoreLens(allAnswers[lensId]);
  }

  // the core opposition: the axis the identity's dominant belongs to,
  // oriented so S1 is the identity's own pole
  const domId = lenses.identity.dominantId;
  const axis = AXES.find((ax) => ax.a === domId || ax.b === domId);
  const flipped = axis.b === domId;
  const square = {
    axis,
    s1: { id: flipped ? axis.b : axis.a, term: flipped ? axis.s2 : axis.s1, not: flipped ? axis.nots2 : axis.nots1 },
    s2: { id: flipped ? axis.a : axis.b, term: flipped ? axis.s1 : axis.s2, not: flipped ? axis.nots1 : axis.nots2 },
  };

  // plot each lens into the square: x = allegiance between poles, y = assertion
  const p1 = byId[square.s1.id].index, p2 = byId[square.s2.id].index;
  for (const lensId of Object.keys(lenses)) {
    const L = lenses[lensId];
    const a1 = poleAffinity(L.vector, p1), a2 = poleAffinity(L.vector, p2);
    L.x = (a1 - a2) / (a1 + a2 + 1e-9); // -1 (S2) … +1 (S1)
    L.y = L.assertion;                   //  0 (negation) … 1 (assertion)
  }

  // vertical placement: absolute assertion, damped when the position
  // sounds in minor (a position held in shadow is held less fully)
  Object.values(lenses).forEach((L) => {
    const minorDrop = L.mode === 'minor' ? 0.08 : 0;
    L.yPlot = Math.max(0.08, Math.min(0.92, 0.14 + 0.76 * L.y - minorDrop));
  });

  return { ...lenses, square };
}
