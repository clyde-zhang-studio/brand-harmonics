/* =====================================================================
   wheel.js — the circle of fifths, drawn.
   Twelve nodes (key + archetype), four position-orbs, gap-chords
   whose color is their consonance, and the journey arc.
   Returns SVG markup; app.js wires the events.
   ===================================================================== */

import { ARCHETYPES } from './data.js';
import { pretty, wrap, circleDistance } from './theory.js';

export const LENS_COLOR = {
  identity: '#f0ad1f', audience: '#159f87', image: '#2c53c9', aspiration: '#e8402a',
};

/* consonance → color: teal (kin) through gold to cadmium red (crisis) */
export function gapColor(d) {
  return ['#159f87', '#5aa757', '#f0ad1f', '#ef8b1d', '#ec6a20', '#ea5325', '#e8402a'][d] || '#e8402a';
}

const CX = 330, CY = 330, R = 244, SIZE = 660;
const rad = (deg) => (deg * Math.PI) / 180;
const angleOf = (i) => -90 + wrap(i) * 30;
const pt = (i, r = R) => {
  const a = rad(angleOf(i));
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

function arcPath(i, j, r = R) {
  // short clockwise arc from node i to node j along the ring
  const [x1, y1] = pt(i, r), [x2, y2] = pt(j, r);
  const sweep = 1; // callers pass consecutive clockwise nodes
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/* options: { positions: {lensId: {index, mode}}, gaps: [{id, a, b, ai, bi, dist}],
              journey: {path:[idx…], dir} | null, activeGap: id|null }        */
export function renderWheel(opts = {}) {
  const { positions = null, gaps = [], journey = null } = opts;
  let s = `<svg class="wheel" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="circle of fifths with brand positions">`;
  s += `<defs>
    <filter id="orbglow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softglow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  // quadrant halos (arcs of three keys)
  const quadArc = (startIdx, color) => {
    const a1 = rad(angleOf(startIdx) - 13), a2 = rad(angleOf(startIdx + 2) + 13);
    const r0 = R;
    const p1 = [CX + r0 * Math.cos(a1), CY + r0 * Math.sin(a1)];
    const p2 = [CX + r0 * Math.cos(a2), CY + r0 * Math.sin(a2)];
    return `<path d="M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A ${r0} ${r0} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" class="quadarc" stroke="${color}"/>`;
  };
  s += quadArc(11, 'rgba(240,173,31,.16)'); // the open: F C G
  s += quadArc(2, 'rgba(21,159,135,.16)');  // the near: D A E
  s += quadArc(5, 'rgba(232,64,42,.14)');   // the forge: B F# Db
  s += quadArc(8, 'rgba(44,83,201,.14)');   // the keep: Ab Eb Bb

  s += `<circle cx="${CX}" cy="${CY}" r="${R}" class="ring"/>`;

  // journey arc (under the chords, over the ring)
  if (journey && journey.path && journey.path.length > 1) {
    for (let k = 0; k + 1 < journey.path.length; k++) {
      const i = journey.path[k], j = journey.path[k + 1];
      const cwNext = wrap(i + 1) === wrap(j);
      const d = cwNext ? arcPath(i, j) : arcPath(j, i);
      s += `<path d="${d}" class="journeyarc flow" filter="url(#softglow)"/>`;
    }
  }

  // gap chords (interior curves)
  gaps.forEach((g) => {
    if (g.ai === g.bi) return; // unison: no line to draw
    const [x1, y1] = pt(g.ai, R - 26), [x2, y2] = pt(g.bi, R - 26);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const pull = 0.28 + 0.6 * (circleDistance(g.ai, g.bi) / 6); // farther = deeper through the middle
    const cx2 = mx + (CX - mx) * pull, cy2 = my + (CY - my) * pull;
    s += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"
      class="gapchord" data-gap="${g.id}" stroke="${gapColor(g.dist)}"/>`;
  });

  // the twelve nodes
  ARCHETYPES.forEach((a, i) => {
    const [x, y] = pt(i);
    const [lx, ly] = pt(i, R + 40);
    const dim = positions && !Object.values(positions).some((p) => p.index === i)
      && !(journey && journey.path && journey.path.includes(i));
    s += `<g class="node ${dim ? 'dim' : ''}" data-idx="${i}">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="tick"/>
      <text x="${x.toFixed(1)}" y="${(y + 1).toFixed(1)}" class="keylabel" dy="-14">${pretty(a.key)}</text>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="archlabel">${a.name.replace('The ', '')}</text>
    </g>`;
  });

  // position orbs — stacked inward when several share a key
  if (positions) {
    const byIndex = {};
    Object.entries(positions).forEach(([lens, p]) => {
      (byIndex[p.index] = byIndex[p.index] || []).push({ lens, ...p });
    });
    Object.entries(byIndex).forEach(([idx, list]) => {
      list.forEach((p, slot) => {
        const [x, y] = pt(+idx, R - 34 - slot * 30);
        const c = LENS_COLOR[p.lens];
        const ring = p.mode === 'minor'
          ? `<circle cx="${x}" cy="${y}" r="15" class="minorring" stroke="${c}"/>` : '';
        s += `<g class="orb" data-lens="${p.lens}">
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9.5" fill="${c}" class="orbdot"/>
          ${ring}
        </g>`;
      });
    });
  }

  s += `</svg>`;
  return s;
}
