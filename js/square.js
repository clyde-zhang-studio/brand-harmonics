/* =====================================================================
   square.js — the Greimas square, drawn.
   S1 and S2 across the top (contraries), their negations beneath,
   implication up the sides, contradiction across the diagonals —
   and the four brand positions plotted inside the territory.
   ===================================================================== */

import { byId } from './data.js';
import { pretty } from './theory.js';
import { LENS_COLOR } from './wheel.js';

const W = 760, H = 560;
const L = 150, Rt = 610, T = 120, B = 440; // corner coordinates

/* study: output of runStudy; lenses carry .x (-1..1) and .yPlot (0..1) */
export function renderSquare(study) {
  const { square } = study;
  const a1 = byId[square.s1.id], a2 = byId[square.s2.id];

  const plotX = (x) => L + 60 + (1 - (x + 1) / 2) * (Rt - L - 120); // x = +1 → left corner (S1)
  const plotY = (yp) => B - 24 - yp * (B - T - 48);

  let s = `<svg class="gsquare" viewBox="0 0 ${W} ${H}" role="img" aria-label="semiotic square with brand positions">`;
  s += `<defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="rgba(255,247,237,.5)" stroke-width="1.4"/>
    </marker>
    <filter id="sqglow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  // relations
  s += `<line x1="${L}" y1="${T}" x2="${Rt}" y2="${T}" class="rel contraries"/>`;
  s += `<line x1="${L}" y1="${B}" x2="${Rt}" y2="${B}" class="rel subcontraries"/>`;
  s += `<line x1="${L}" y1="${B - 26}" x2="${L}" y2="${T + 26}" class="rel implication" marker-end="url(#arr)"/>`;
  s += `<line x1="${Rt}" y1="${B - 26}" x2="${Rt}" y2="${T + 26}" class="rel implication" marker-end="url(#arr)"/>`;
  s += `<line x1="${L + 18}" y1="${T + 14}" x2="${Rt - 18}" y2="${B - 14}" class="rel contradiction"/>`;
  s += `<line x1="${Rt - 18}" y1="${T + 14}" x2="${L + 18}" y2="${B - 14}" class="rel contradiction"/>`;

  // relation captions
  s += `<text x="${(L + Rt) / 2}" y="${T - 46}" class="relcap">contraries — the tension that generates the territory</text>`;
  s += `<text x="${(L + Rt) / 2}" y="${B + 52}" class="relcap">the neutral band — meaning withheld</text>`;
  s += `<text x="${L - 24}" y="${(T + B) / 2}" class="relcap side" transform="rotate(-90 ${L - 24} ${(T + B) / 2})">implication</text>`;
  s += `<text x="${Rt + 24}" y="${(T + B) / 2}" class="relcap side" transform="rotate(90 ${Rt + 24} ${(T + B) / 2})">implication</text>`;

  // corners
  const corner = (x, y, term, sub, anchor) => `
    <g class="corner" text-anchor="${anchor}">
      <text x="${x}" y="${y - 14}" class="cterm">${term}</text>
      <text x="${x}" y="${y + 10}" class="csub">${sub}</text>
    </g>`;
  s += corner(L, T, square.s1.term, `${a1.name} — ${pretty(a1.key)}`, 'start');
  s += corner(Rt, T, square.s2.term, `${a2.name} — ${pretty(a2.key)}`, 'end');
  s += corner(L, B + 6, `not-${square.s2.term.toLowerCase()}`, square.s2.not, 'start');
  s += corner(Rt, B + 6, `not-${square.s1.term.toLowerCase()}`, square.s1.not, 'end');

  // the four positions — with a small layout pass so clustered orbs and
  // their labels stay legible: overlapping orbs fan out horizontally,
  // labels in a cluster stack at increasing offsets
  const pts = ['identity', 'audience', 'image', 'aspiration'].map((lens) => {
    const Lz = study[lens];
    return { lens, mode: Lz.mode, x: plotX(Lz.x), y: plotY(Lz.yPlot) };
  });
  // separate orbs that sit on top of each other
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
      if (Math.hypot(dx, dy) < 22) { pts[j].x += dx >= 0 ? 22 : -22; }
    }
  }
  // labels: within a cluster, stack alternating above/below at growing gaps
  const LABEL_SLOTS = [-22, 32, -40, 50];
  pts.forEach((p) => {
    const cluster = pts.filter((o) => Math.abs(o.x - p.x) < 90 && Math.abs(o.y - p.y) < 46);
    p.slot = cluster.indexOf(p) >= 0 ? cluster.findIndex((o) => o === p) : 0;
  });
  pts.forEach((p) => {
    const c = LENS_COLOR[p.lens];
    const labelY = p.y + LABEL_SLOTS[p.slot % LABEL_SLOTS.length];
    const ring = p.mode === 'minor' ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="15" class="minorring" stroke="${c}"/>` : '';
    s += `<g class="orb">
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="9.5" fill="${c}" class="orbdot"/>${ring}
      <text x="${p.x.toFixed(1)}" y="${labelY.toFixed(1)}" class="orblabel" fill="${c}">${p.lens}</text>
    </g>`;
  });

  s += `</svg>`;
  return s;
}
