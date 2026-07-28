/* =====================================================================
   app.js — the conductor.
   Screen flow: landing → setup → assessment (four movements) →
   the reading (square) → the sound (wheel) → the movement (journey) →
   the lead sheet. Plus the field notes (methodology).
   ===================================================================== */

import {
  ARCHETYPES, AXES, LENSES, byId, GAP_DEFS, INTERVAL_CLASSES, BRIDGES,
  CADENCES, MODE_GLOSS, PRESETS, METHODOLOGY, APP, QUADRANTS, SHADOW_GAP,
  MOVE_GLOSSES, SAYNOT, GENRES,
} from './data.js';
import {
  pretty, keyOf, wrap, circleDistance, signatureChord, chord,
  movementChords, cadenceProgression, fullProgression, futureMoves,
  genreDests, ACCIDENTALS,
} from './theory.js';
import { runStudy } from './scoring.js';
import * as audio from './audio.js';
import { composePiece } from './composer.js';
import { renderWheel, LENS_COLOR, gapColor } from './wheel.js';
import { renderSquare } from './square.js';

const LENS_ORDER = ['identity', 'audience', 'image', 'aspiration'];
const MOVEMENT_NUMERALS = ['I', 'II', 'III', 'IV'];
const ITEMS_PER_LENS = 7; // six axes + one valence

const state = {
  screen: 'landing',
  brandName: '',
  answers: null,
  lens: 0, item: 0,
  study: null, prog: null, gaps: null,
  destIdx: null, destMode: 'major', destVia: null, // the chosen future
  cameFrom: 'landing',
};

const stage = document.getElementById('stage');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* register a chord for audio: keep roots in a warm octave */
const reg = (pc) => 48 + (pc > 7 ? pc - 12 : pc);
const playable = (c) => ({ rootMidi: reg(c.rootSemitone), intervals: c.intervals });

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setScreen(name) {
  audio.stopAll();
  state.screen = name;
  stage.classList.add('leaving');
  setTimeout(() => {
    try {
      stage.innerHTML = RENDER[name]();
      WIRE[name] && WIRE[name]();
    } catch (err) {
      // never leave the reader staring at an empty cream page
      stage.innerHTML = `<section class="panel narrow"><p class="overline">a wrong note</p>
        <h2 class="h2">Something in the score failed to load.</h2>
        <p class="body">Reloading usually clears it. If it keeps happening, the browser console has the detail.</p>
        <div class="btnrow"><button class="btn primary" onclick="location.reload()">reload</button></div></section>`;
      console.error(err);
    }
    stage.classList.remove('leaving');
    window.scrollTo({ top: 0 });
    armReveals();
    announceScreen();
  }, 260);
}

/* move focus and announce a short phrase — not the whole screen */
function announceScreen() {
  const heading = stage.querySelector('.h2, .title');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  const announcer = document.getElementById('announcer');
  if (announcer && heading) announcer.textContent = heading.textContent.trim();
}

/* collage pieces paste themselves down as they scroll into view */
let revealObserver = null;
function armReveals() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('pasted'); revealObserver.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  qa('.movecard, .roadrow, .sayrow, .gaprow, .phase, .poscard, .preset, .measure, .nowcard').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 55}ms`;
    revealObserver.observe(el);
  });
}

function freshAnswers() {
  const a = {};
  LENS_ORDER.forEach((l) => { a[l] = { axes: new Array(6).fill(null), valence: null }; });
  return a;
}

/* ---- study assembly ---------------------------------------------- */
function finishStudy() {
  state.study = runStudy(state.answers);
  LENS_ORDER.forEach((l) => { state.study[l].arch = byId[state.study[l].dominantId]; });
  state.gaps = GAP_DEFS.map((g, i) => {
    const ai = state.study[g.a].index, bi = state.study[g.b].index;
    return { ...g, id: 'g' + i, ai, bi, dist: circleDistance(ai, bi) };
  });
  // default destination: the stated ambition, until a future is chosen
  chooseDestination(state.study.aspiration.index, state.study.aspiration.mode, 'stated');
  setScreen('reading');
}

function chooseDestination(destIdx, destMode, via) {
  state.destIdx = wrap(destIdx);
  state.destMode = destMode || 'major';
  state.destVia = via;
  const genre = via === 'jazz' || via === 'pop' ? via : 'classical';
  state.prog = fullProgression(state.study, state.destIdx, state.destMode, genre);
}

function bridgeFor(fromIdx, toIdx) {
  const f = ARCHETYPES[wrap(fromIdx)].id, t = ARCHETYPES[wrap(toIdx)].id;
  if (BRIDGES[`${f}>${t}`]) return { ...BRIDGES[`${f}>${t}`], reversed: false };
  return { ...BRIDGES[`${t}>${f}`], reversed: true };
}

function governingGap() {
  return state.gaps.reduce((m, g) => (g.dist > m.dist ? g : m), state.gaps[0]);
}

const modeWord = (m) => (m === 'minor' ? 'minor' : 'major');
const posLine = { identity: 'essence', audience: 'audienceLine', image: 'imageLine', aspiration: 'aspirationLine' };

/* =====================================================================
   RENDERERS
   ===================================================================== */
const RENDER = {};
const WIRE = {};

/* ---- landing ------------------------------------------------------ */
function teaserSVG() {
  // a miniature circle of fifths: keys, four sample position orbs,
  // one consonant chord (C–G) and one tritone (C–F♯), dashed ring spinning
  const KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
  const pt = (i, r) => {
    const a = ((-90 + i * 30) * Math.PI) / 180;
    return [170 + r * Math.cos(a), 170 + r * Math.sin(a)];
  };
  let s = `<svg class="teaser" viewBox="0 0 340 340" aria-label="miniature circle of fifths with brand positions">`;
  s += `<g class="tring"><circle cx="170" cy="170" r="152" fill="none" stroke="var(--ink)" stroke-opacity=".5" stroke-width="1.6" stroke-dasharray="4 8"/></g>`;
  s += `<circle cx="170" cy="170" r="132" fill="none" stroke="var(--ink)" stroke-opacity=".55" stroke-width="1.8"/>`;
  KEYS.forEach((k, i) => {
    const [tx, ty] = pt(i, 132);
    const [lx, ly] = pt(i, 110);
    s += `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3" fill="var(--ink)"/>`;
    s += `<text x="${lx.toFixed(1)}" y="${(ly + 5).toFixed(1)}" text-anchor="middle" fill="var(--ink)" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:17px">${k}</text>`;
  });
  const [cx1, cy1] = pt(0, 132), [gx, gy] = pt(1, 132), [fx, fy] = pt(6, 132);
  s += `<path d="M ${cx1} ${cy1} Q 205 92 ${gx.toFixed(1)} ${gy.toFixed(1)}" fill="none" stroke="#159f87" stroke-width="3.5"/>`;
  s += `<path d="M ${cx1} ${cy1} Q 178 170 ${fx} ${fy}" fill="none" stroke="#e8402a" stroke-width="3.5" stroke-dasharray="7 5"/>`;
  [[0, '#f0ad1f'], [1, '#159f87'], [6, '#e8402a'], [10, '#2c53c9']].forEach(([i, c]) => {
    const [x, y] = pt(i, 132);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5" fill="${c}" class="orbdot"/>`;
  });
  s += `</svg>`;
  return s;
}

RENDER.landing = () => `
  <section class="hero">
    <div class="herogrid">
      <div>
        <p class="overline">strategy you can hear</p>
        <h1 class="title">${APP.title}</h1>
        ${APP.landing.map((p) => `<p class="lede">${p}</p>`).join('')}
        <div class="btnrow">
          <button class="btn big c-red" data-act="begin"><span class="btnmain">begin a study</span><span class="btnsub">four movements · about three minutes</span></button>
          <button class="btn big c-blue" data-act="demo"><span class="btnmain">ride a demo brand</span><span class="btnsub">three brands, already played</span></button>
          <button class="btn big c-gold" data-act="notes"><span class="btnmain">field notes</span><span class="btnsub">how the map works</span></button>
        </div>
        <p class="credit">a study by <strong>Clyde Zhang</strong> · <a href="mailto:clyde.duduo.zhang@gmail.com">clyde.duduo.zhang@gmail.com</a></p>
      </div>
      <div class="teaserwrap">
        ${teaserSVG()}
        <span class="stickerchord sc1">F♯7♯9</span>
        <span class="stickerchord sc2">IV → I</span>
        <span class="stickerchord sc3">diabolus!</span>
        <p class="teasecap">twelve archetypes · twelve keys · four positions of one brand</p>
      </div>
    </div>
  </section>`;

WIRE.landing = () => {
  q('[data-act=begin]').onclick = () => { state.cameFrom = 'setup'; setScreen('setup'); };
  q('[data-act=demo]').onclick = () => setScreen('setup');
  q('[data-act=notes]').onclick = () => { state.cameFrom = 'landing'; setScreen('notes'); };
};

/* ---- setup -------------------------------------------------------- */
RENDER.setup = () => `
  <section class="panel narrow">
    <p class="overline">the subject</p>
    <h2 class="h2">Name the brand</h2>
    <p class="body">A real one you know intimately, or one you are imagining into being. The study asks you to answer from four positions — as the brand’s conscience, as its people, as its reputation, as its future — so choose one you can speak for.</p>
    <div class="namerow">
      <input id="brandname" class="input" type="text" placeholder="the brand’s name" maxlength="40" autocomplete="off"/>
      <button class="btn primary" data-act="start">begin the four movements</button>
    </div>
    <div class="ruleline"><span>or ride a study already played</span></div>
    <div class="presets">
      ${PRESETS.map((p) => `
        <button class="preset" data-preset="${p.id}">
          <span class="pname">${p.name}</span>
          <span class="psector">${p.sector}</span>
          <span class="pblurb">${p.blurb}</span>
          <span class="pgo">hear this study →</span>
        </button>`).join('')}
    </div>
    <p class="backlink"><button type="button" class="linkbtn" data-act="back">← back</button></p>
  </section>`;

WIRE.setup = () => {
  const input = q('#brandname');
  input.value = state.brandName || '';
  setTimeout(() => input.focus(), 350);
  const start = () => {
    state.brandName = input.value.trim() || 'the brand';
    state.answers = freshAnswers();
    state.lens = 0; state.item = 0;
    setScreen('assess');
  };
  q('[data-act=start]').onclick = start;
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') start(); });
  qa('[data-preset]').forEach((el) => el.onclick = () => {
    const p = PRESETS.find((x) => x.id === el.dataset.preset);
    state.brandName = p.name;
    state.answers = JSON.parse(JSON.stringify(p.answers));
    finishStudy();
  });
  q('[data-act=back]').onclick = () => setScreen('landing');
};

/* ---- assessment --------------------------------------------------- */
RENDER.assess = () => {
  state.item = Math.min(state.item, ITEMS_PER_LENS - 1); // never render past the valence item
  const lens = LENSES[state.lens];
  const isValence = state.item === 6;
  const progress = LENS_ORDER.map((l, li) => `
    <span class="pgroup ${li === state.lens ? 'now' : ''}">
      ${Array.from({ length: ITEMS_PER_LENS }, (_, ii) => {
        const done = li < state.lens || (li === state.lens && ii < state.item);
        return `<i class="dot ${done ? 'done' : ''} ${li === state.lens && ii === state.item ? 'here' : ''}"></i>`;
      }).join('')}
    </span>`).join('');

  let body;
  if (!isValence) {
    const ax = AXES[state.item];
    const [sa, sb] = ax.statements[lens.id];
    body = `
      <p class="axisname">${ax.gloss}</p>
      <div class="pair">
        <div class="statement" data-side="a"><p>${sa}</p></div>
        <div class="vs">or</div>
        <div class="statement" data-side="b"><p>${sb}</p></div>
      </div>
      <div class="choices">
        <button class="btn choice" data-side="a" data-strength="2">the first, strongly</button>
        <button class="btn choice" data-side="a" data-strength="1">the first, on balance</button>
        <button class="btn choice" data-side="b" data-strength="1">the second, on balance</button>
        <button class="btn choice" data-side="b" data-strength="2">the second, strongly</button>
      </div>`;
  } else {
    const v = lens.valence;
    body = `
      <p class="axisname">${v.q}</p>
      <div class="choices stacked">
        <button class="btn choice wide" data-valence="major">${v.major}</button>
        <button class="btn choice wide" data-valence="minor">${v.minor}</button>
      </div>
      <p class="hint">This sets the mode — major or minor — in which this position will sound.</p>`;
  }

  return `
  <section class="panel narrow">
    <div class="progress">${progress}</div>
    <p class="overline">movement ${MOVEMENT_NUMERALS[state.lens]} of IV · ${esc(state.brandName)}</p>
    <h2 class="h2">${lens.title}</h2>
    <p class="lensprompt">${lens.prompt}</p>
    ${body}
    <p class="backlink">${state.lens + state.item > 0 ? '<button type="button" class="linkbtn" data-act="prev">← previous</button>' : '<button type="button" class="linkbtn" data-act="quit">← abandon study</button>'}</p>
  </section>`;
};

WIRE.assess = () => {
  const lensId = LENSES[state.lens].id;
  let answered = false; // one answer per item
  let advanced = false; // and exactly one advance, however it is triggered
  const advance = () => {
    if (advanced) return;
    advanced = true;
    state.item++;
    if (state.item >= ITEMS_PER_LENS) { state.item = 0; state.lens++; }
    if (state.lens >= 4) { finishStudy(); return; }
    setScreen('assess');
  };
  qa('.choice[data-strength]').forEach((el) => el.onclick = () => {
    if (answered) { advance(); return; } // a second tap nudges forward, never double-advances
    answered = true;
    state.answers[lensId].axes[state.item] = { side: el.dataset.side, strength: +el.dataset.strength };
    el.classList.add('picked');
    setTimeout(advance, 240);
  });
  qa('.choice[data-valence]').forEach((el) => el.onclick = () => {
    if (answered) { advance(); return; }
    answered = true;
    state.answers[lensId].valence = el.dataset.valence;
    el.classList.add('picked');
    setTimeout(advance, 240);
  });
  const prev = q('[data-act=prev]');
  if (prev) prev.onclick = () => {
    if (state.item === 0) { state.lens--; state.item = ITEMS_PER_LENS - 1; } else state.item--;
    setScreen('assess');
  };
  const quit = q('[data-act=quit]');
  if (quit) quit.onclick = () => setScreen('landing');
};

/* ---- the reading (semiotic square) -------------------------------- */
RENDER.reading = () => {
  const st = state.study;
  const s1 = st.square.s1, s2 = st.square.s2;
  const idA = st.identity.arch;
  const positions = LENS_ORDER.map((l) => {
    const L = st[l];
    const lensDef = LENSES.find((x) => x.id === l);
    const loose = L.yPlot < 0.3;
    return `
      <div class="poscard" style="--c:${LENS_COLOR[l]}">
        <p class="poslens">${lensDef.title} <span class="posnote">· ${lensDef.poetic}</span></p>
        <p class="posarch">${L.arch.name} — ${pretty(L.arch.key)} ${modeWord(L.mode)}</p>
        <p class="body">${L.arch[posLine[l]]}</p>
        ${L.mode === 'minor' ? `<p class="minornote">${MODE_GLOSS.minor}. In shadow: ${L.arch.shadow}.</p>` : ''}
        ${loose ? `<p class="minornote">Held loosely — this position drifts toward the square’s neutral band, where meaning goes unclaimed.</p>` : ''}
      </div>`;
  }).join('');

  return `
  <section class="panel">
    <p class="overline">${esc(state.brandName)} · the reading</p>
    <h2 class="h2">The territory of meaning</h2>
    <p class="body">${esc(state.brandName)} composes itself around <strong>${s1.term}</strong> — the governing value of ${s1.id === idA.id ? 'its identity, ' : ''}${idA.name}. Every claim of ${s1.term.toLowerCase()} summons its contrary, <strong>${s2.term}</strong> (${byId[s2.id].name}), and between value, counter-value and their negations a territory opens. The four positions of the brand are plotted inside it.</p>
    ${renderSquare(st)}
    <div class="poscards">${positions}</div>
    <div class="btnrow"><button class="btn primary" data-act="next">now hear it →</button></div>
  </section>`;
};

WIRE.reading = () => { q('[data-act=next]').onclick = () => setScreen('sound'); };

/* ---- the sound (circle of fifths + gaps) --------------------------- */
RENDER.sound = () => {
  const st = state.study;
  const gov = governingGap();
  const positions = {};
  LENS_ORDER.forEach((l) => { positions[l] = { index: st[l].index, mode: st[l].mode }; });

  const legend = LENS_ORDER.map((l) => {
    const d = LENSES.find((x) => x.id === l);
    return `<button class="chip" data-poslens="${l}" style="--c:${LENS_COLOR[l]}"><i class="swatch"></i>${d.short} — ${pretty(st[l].arch.key)} ${modeWord(st[l].mode)} <span class="playglyph">▸</span></button>`;
  }).join('');

  const gapRows = [...state.gaps].sort((a, b) => b.dist - a.dist).map((g) => {
    const A = st[g.a], B = st[g.b];
    const shadow = g.dist === 0 && A.mode !== B.mode;
    const ic = shadow ? SHADOW_GAP : INTERVAL_CLASSES[g.dist];
    const intervalName = shadow ? SHADOW_GAP.name : INTERVAL_CLASSES[g.dist].name;
    return `
      <div class="gaprow ${g.id === gov.id ? 'governing' : ''}" data-gaprow="${g.id}">
        <div class="gaphead">
          <span class="gapname">${g.name}${g.id === gov.id ? '<span class="govbadge">the governing tension</span>' : ''}</span>
          <button class="btn small" data-playgap="${g.id}">▸ hear it</button>
        </div>
        <p class="gapkeys" style="color:${shadow ? '#cf8aae' : gapColor(g.dist)}">${pretty(A.arch.key)} ${A.mode === 'minor' ? 'minor' : ''} ↔ ${pretty(B.arch.key)} ${B.mode === 'minor' ? 'minor' : ''} — ${intervalName}</p>
        <p class="gapq">${g.question}</p>
        <p class="body">${ic.musical}. ${ic.strategic}</p>
      </div>`;
  }).join('');

  return `
  <section class="panel">
    <p class="overline">${esc(state.brandName)} · the sound</p>
    <h2 class="h2">Four positions, set ringing</h2>
    <p class="body">Each position resolves to a key on the circle of fifths. Distance on the circle is harmonic distance: neighbors are kin, the far point is the tritone. Press anything.</p>
    <div class="legend">${legend}</div>
    ${renderWheel({ positions, gaps: state.gaps })}
    <div class="nowcard">
      <div>
        <p class="posarch">the chord of now</p>
        <p class="body">${LENS_ORDER.map((l) => pretty(st[l].arch.key)).join(' · ')} sounded together — the brand’s four positions as one sonority. This is what ${esc(state.brandName)} sounds like today.</p>
      </div>
      <button class="btn primary" data-act="tetrad">▸ the sound of now</button>
    </div>
    <div class="gaplist">${gapRows}</div>
    <div class="btnrow"><button class="btn primary" data-act="next">compose the move →</button></div>
  </section>`;
};

WIRE.sound = () => {
  const st = state.study;
  qa('[data-poslens]').forEach((el) => el.onclick = () => {
    const l = el.dataset.poslens;
    const sig = signatureChord(st[l].index, st[l].mode);
    audio.stopAll();
    audio.playChord(reg(sig.rootSemitone), sig.intervals, { duration: 2.8 });
  });
  qa('[data-playgap]').forEach((el) => el.onclick = () => {
    const g = state.gaps.find((x) => x.id === el.dataset.playgap);
    const triad = (lens) => (st[lens].mode === 'minor' ? [0, 3, 7] : [0, 4, 7]);
    audio.playPolychord(reg(signatureChord(g.ai).rootSemitone), triad(g.a), reg(signatureChord(g.bi).rootSemitone), triad(g.b));
  });
  q('[data-act=tetrad]').onclick = () => {
    audio.playTetrad(LENS_ORDER.map((l) => reg(signatureChord(st[l].index).rootSemitone)));
  };
  q('[data-act=next]').onclick = () => setScreen('futures');
};

/* ---- the possible futures (the harmonic options menu) -------------- */
const REACH_WORDS = ['stay and deepen', 'one movement', 'one movement', 'two movements', 'two movements', 'two movements', 'two movements'];
const EARSHOT_WORDS = ['on their note', 'in earshot', 'close by', 'a stretch to hear', 'far from them', 'far from them', 'their far point'];
const BELIEF_WORDS = ['already believed', 'credible today', 'earnable', 'earnable', 'a hard sell', 'a hard sell', 'will meet doubt'];

RENDER.futures = () => {
  const st = state.study;
  const home = st.identity;
  const statedIdx = st.aspiration.index;
  const dests = genreDests(home.index, st.audience.index, st.image.index);
  const statedShown = GENRES.some((g) => dests[g.id] === statedIdx);

  const chip = (label, word, dist) =>
    `<span class="meterchip" style="--mc:${gapColor(dist)}"><i></i>${label}: ${word}</span>`;

  const card = (g) => {
    const destIdx = dests[g.id];
    const dest = ARCHETYPES[destIdx];
    const reach = circleDistance(home.index, destIdx);
    const earshot = circleDistance(destIdx, st.audience.index);
    const belief = circleDistance(destIdx, st.image.index);
    let gloss = g.gloss.replaceAll('{dest}', `the ${dest.name.replace('The ', '')}`);
    if (g.id === 'pop' && dests.popIsGearShift) {
      gloss += ' You already stand on your people’s note — so this is the gear-shift: everything up a step, energy first.';
    }
    const stated = destIdx === statedIdx;
    return `
      <div class="movecard ${stated ? 'stated' : ''}" data-move="${g.id}">
        <div class="movehead">
          <span class="movetitle">${g.title}</span>
          <span class="movemech">${g.tagline}</span>
        </div>
        <p class="movedest">→ ${dest.name} · ${pretty(dest.key)}${stated ? '<span class="statedbadge">your stated ambition</span>' : ''}</p>
        <p class="body">${gloss}</p>
        <div class="chiprow">
          ${chip('reach', REACH_WORDS[reach], reach)}
          ${chip('audience', EARSHOT_WORDS[earshot], earshot)}
          ${chip('belief', BELIEF_WORDS[belief], belief)}
        </div>
        <div class="btnrow tight">
          <button class="btn small" data-hearvia="${g.id}" data-heardest="${destIdx}">▸ hear it</button>
          <button class="btn small primary" data-choose="${destIdx}" data-via="${g.id}">compose this →</button>
        </div>
      </div>`;
  };

  // the stated ambition, when no genre route lands on it: an honest footnote
  let alsoran = '';
  if (!statedShown) {
    const dest = st.aspiration.arch;
    const aud = circleDistance(statedIdx, st.audience.index);
    const belief = circleDistance(statedIdx, st.image.index);
    alsoran = `
      <div class="alsoran">
        <strong>Your stated ambition</strong> — ${dest.name} in ${pretty(dest.key)} — isn’t where any of the three genres naturally land
        (audience: ${EARSHOT_WORDS[aud].toLowerCase()} · belief: ${BELIEF_WORDS[belief].toLowerCase()}).
        It may still be right — strategy outranks arithmetic when it has a reason.
        <button type="button" class="linkbtn" data-choose="${statedIdx}" data-via="stated">compose it anyway, by the book →</button>
      </div>`;
  }

  return `
  <section class="panel">
    <p class="overline">${esc(state.brandName)} · the possible futures</p>
    <h2 class="h2">Three ways forward — pick a genre</h2>
    <p class="body">This is where the wheel stops describing and starts proposing. The same brand can move like <em>classical</em> (seamless, prepared, nothing to forgive), like <em>jazz</em> (a leap held in tension until the room leans in), or like <em>pop</em> (go where your people are and repeat the hook). Each genre picks its own destination from where ${esc(state.brandName)} stands. Press ▸ to hear each route played in its style.</p>
    <div class="futures">${GENRES.map(card).join('')}</div>
    ${alsoran}
    <p class="hint">Choosing a route composes the plan and the brief for it. You can come back and choose differently.</p>
  </section>`;
};

WIRE.futures = () => {
  const st = state.study;
  qa('[data-hearvia]').forEach((el) => el.onclick = () => {
    const via = el.dataset.hearvia;
    const dest = +el.dataset.heardest;
    const prog = fullProgression(st, dest, 'major', via);
    audio.playProgression(prog.bars.map((b) => playable(b.chord)), { secondsPerChord: via === 'pop' ? 1.1 : 1.4 });
  });
  qa('[data-choose]').forEach((el) => el.onclick = () => {
    const dest = +el.dataset.choose;
    const mode = dest === st.aspiration.index ? st.aspiration.mode : 'major';
    chooseDestination(dest, mode, el.dataset.via);
    setScreen('movement');
  });
};

/* ---- the movement (two movements and an arrival) ------------------- */
function expandPath(a, b) {
  a = wrap(a); b = wrap(b);
  const cw = wrap(b - a);
  const sign = cw <= 6 ? +1 : -1;
  const steps = Math.min(cw, 12 - cw);
  return Array.from({ length: steps + 1 }, (_, k) => wrap(a + sign * k));
}

const MOVEMENT_TIME = ['now', 'next'];

RENDER.movement = () => {
  const st = state.study;
  const { journey, cadence } = state.prog;
  const A = st.identity, destA = ARCHETYPES[state.destIdx];
  const cad = CADENCES[cadence];

  // visual path for the wheel (per-fifth arc, purely presentational)
  let path = [A.index];
  journey.movements.forEach((m) => { path = path.concat(expandPath(m.from, m.to).slice(1)); });

  let movementBlock;
  if (journey.inPlace) {
    movementBlock = `
      <div class="phase">
        <p class="phasename">the movement — deepen in ${pretty(A.arch.key)} <span class="posnote">· now</span></p>
        <p class="body">Identity and destination share a key. The strategy is not movement but depth: the same chord voiced more fully, the position held with more conviction — and if the echo is minor, the work is re-voicing the third, not moving the tonic.</p>
        <button class="btn small" data-playmvt="inplace">▸ hear the reaffirmation</button>
      </div>`;
  } else if (journey.genre) {
    const g = GENRES.find((x) => x.id === journey.genre);
    const audDist = circleDistance(state.destIdx, st.audience.index);
    const audNote = audDist === 0 ? ' It lands exactly on your people’s note.' : audDist <= 1 ? ' It lands beside your people’s own position.' : '';
    movementBlock = `
      <div class="phase">
        <p class="phasename">the ${g.title.toLowerCase()} route — ${pretty(A.arch.key)} → ${pretty(destA.key)} <span class="posnote">· now</span></p>
        <p class="pivotline">${g.tagline}</p>
        <p class="body">${g.moveWhy}${audNote}</p>
        <p class="body chordline">${state.prog.bars.slice(1).map((c) => `<span class="chordtok">${c.chord.label}<i>${c.chord.roman}</i></span>`).join(' ')}</p>
        <button class="btn small" data-playmvt="genre">▸ hear the route</button>
      </div>`;
  } else {
    movementBlock = journey.movements.map((m, i) => {
      const isFinal = i === journey.movements.length - 1;
      const mc = movementChords(m, { resolve: !isFinal });
      const fromA = ARCHETYPES[m.from], toA = ARCHETYPES[m.to];
      const title = journey.movements.length === 1
        ? `the movement — ${pretty(fromA.key)} → ${pretty(toA.key)}`
        : m.type === 'turn'
          ? `movement II — the turn · → ${pretty(toA.key)}`
          : `movement I — the bridge · ${pretty(fromA.key)} → ${pretty(toA.key)}`;
      let narrative;
      if (m.type === 'turn') {
        narrative = `Enter through ${toA.name}’s own grammar. Before the brand claims the new name, it behaves in the new syntax — ${toA.name.replace('The ', 'the ').toLowerCase()}’s ii–V, spoken in your own voice. First proof: ${toA.design.behavior[0].toLowerCase()}`;
      } else if (m.dist === 1) {
        const br = bridgeFor(m.from, m.to);
        narrative = `${br.reversed ? `The bridge crossed the other way — <strong>${br.shared}</strong> is what survives the move. ` : `Shared ground: <strong>${br.shared}</strong>. `}${br.principle}`;
      } else {
        narrative = `Two fifths in one legible move: carry ${fromA.value.toLowerCase()} toward ${toA.value.toLowerCase()} through material both keys own.`;
      }
      return `
        <div class="phase">
          <p class="phasename">${title} <span class="posnote">· ${MOVEMENT_TIME[i] || 'next'}</span></p>
          <p class="pivotline">pivot: ${mc.pivotLabel}</p>
          <p class="body">${narrative}</p>
          <p class="body chordline">${mc.chords.map((c) => `<span class="chordtok">${c.label}<i>${c.roman}</i></span>`).join(' ')}${isFinal ? '<span class="chordtok posnote">…</span>' : ''}</p>
          <p class="body pivotgloss">${mc.pivotGloss}</p>
          <button class="btn small" data-playmvt="${i}">▸ hear this movement</button>
        </div>`;
    }).join('');
  }

  return `
  <section class="panel">
    <p class="overline">${esc(state.brandName)} · the movement</p>
    <h2 class="h2">${journey.inPlace ? `Deepening in ${pretty(A.arch.key)}` : journey.genre ? `From ${pretty(A.arch.key)} to ${pretty(destA.key)}, the ${journey.genre} way` : `From ${pretty(A.arch.key)} to ${pretty(destA.key)}, in ${journey.movements.length === 1 ? 'one movement' : 'two movements'}`}</h2>
    <p class="body">${journey.genre === 'jazz' ? 'Jazz doesn’t sneak up on a key — it leaps, then makes the dissonance feel inevitable.' : journey.genre === 'pop' ? 'Pop doesn’t travel at all — it shows up where the audience already is and starts the chorus.' : 'A brand cannot leap to a distant key without losing the room — but it never needs more than a bridge and a turn.'} ${!journey.genre && journey.movements.length > 1 ? `The bridge passes near your people; the turn adopts the destination’s grammar.` : ''}</p>
    ${renderWheel({ positions: Object.fromEntries(LENS_ORDER.map((l) => [l, { index: st[l].index, mode: st[l].mode }])), gaps: [], journey: { path } })}
    ${movementBlock}
    <div class="phase cadencecard">
      <p class="phasename">the arrival — ${cad.name} (${cad.figure}) <span class="posnote">· the claim</span></p>
      <p class="body">${cad.reading}</p>
      <p class="body"><strong>In practice:</strong> ${cad.principle}</p>
      <p class="body posnote">Chosen by the credibility gap: the reputation sits ${circleDistance(st.image.index, state.destIdx)} fifths from the destination.</p>
      <button class="btn small" data-playmvt="cadence">▸ hear the arrival</button>
    </div>
    <div class="btnrow">
      <button class="btn ghost" data-act="back">← other futures</button>
      <button class="btn primary" data-act="next">open the brief →</button>
    </div>
  </section>`;
};

WIRE.movement = () => {
  const st = state.study;
  const { journey, cadence } = state.prog;
  qa('[data-playmvt]').forEach((el) => el.onclick = () => {
    const v = el.dataset.playmvt;
    let chords;
    if (v === 'inplace') {
      const k = st.identity.index;
      chords = [chord(k, 0), chord(k, 3), chord(k, 4, { seventh: true }), chord(k, 0), chord(k, 3), chord(k, 0)];
    } else if (v === 'genre') {
      chords = state.prog.bars.map((b) => b.chord);
    } else if (v === 'cadence') {
      chords = [chord(state.destIdx, 4, { seventh: true })].concat(cadenceProgression(cadence, state.destIdx, state.destMode));
    } else {
      chords = movementChords(journey.movements[+v], { resolve: true }).chords;
    }
    audio.playProgression(chords.map(playable), { secondsPerChord: journey.genre === 'pop' ? 1.1 : 1.7 });
  });
  q('[data-act=back]').onclick = () => setScreen('futures');
  q('[data-act=next]').onclick = () => setScreen('leadsheet');
};

/* ---- the brief ----------------------------------------------------- */
const CADENCE_BAR_NOTES = {
  authentic: ['arrive — {dest}'],
  plagal: ['arrive — {dest}', 'the amen', 'settled'],
  deceptive: ['the feint — vi', 'the promise again', 'arrive — earned'],
};

function annotateBars() {
  const st = state.study;
  const { cadence, bars } = state.prog;
  const destA = ARCHETYPES[state.destIdx];
  let cadStep = 0;
  return bars.map((b) => {
    let note = '';
    if (b.tag === 'home') note = `home — ${st.identity.arch.epithet}`;
    else if (b.tag === 'deepen') note = 'deepen in place';
    else if (b.tag === 'cadence') {
      const notes = CADENCE_BAR_NOTES[cadence] || [];
      note = (notes[cadStep++] || CADENCES[cadence].name).replace('{dest}', destA.name);
    } else if (b.pivot) note = `pivot — toward ${pretty(keyOf(state.destIdx))}`;
    else if (b.chord.roman === 'I' || b.chord.roman === 'i') note = `anchor — ${ARCHETYPES[b.chord.keyIdx].name}`;
    else if (b.chord.roman.startsWith('ii')) note = `the turn — ${destA.name.replace('The ', 'the ')}’s grammar`;
    else if (b.chord.roman.startsWith('V7')) note = `V7 of ${pretty(b.chord.key)} — prepared`;
    else note = `${b.chord.roman} of ${pretty(b.chord.key)}`;
    return { ...b, note };
  });
}

/* physics of the destination key → creative direction */
const lightOf = (n) => n === 0
  ? 'neutral daylight — white space and unmixed color'
  : n > 0
    ? ['', 'clear morning light, first contrast', 'bright and quick, confident contrast', 'vivid, high-key, saturated accents', 'glittering, high-energy, sharp edges', 'hard light, maximum contrast, compressed type', 'voltage — black plus one electric color'][n]
    : ['', 'soft late-afternoon warmth, gentle contrast', 'burnished and settled — cream, bronze, low sheen', 'deep warmth, low light, generous space', 'dusk tones, interior light, velvet depth', 'twilight depth — indigo, violet, mercury'][-n];
const motionOf = (n) => n >= 3 ? 'fast — snap easings, hard cuts, short travel'
  : n > 0 ? 'brisk — quick, confident transitions'
  : n === 0 ? 'even — unhurried, steady'
  : n >= -2 ? 'settled — soft landings, longer dissolves'
  : 'slow — long dissolves, weighty settles';
const tempoOf = (n) => n >= 3 ? 'up-tempo, driving' : n > 0 ? 'moderato, forward-leaning' : n === 0 ? 'andante, even' : n >= -3 ? 'adagio, warm' : 'largo, deep';

function briefData() {
  const st = state.study;
  const { journey, cadence } = state.prog;
  const home = st.identity.arch, dest = ARCHETYPES[state.destIdx];
  const energy = ACCIDENTALS[dest.key];

  // each move is a small playbook: why this route, what to actually do,
  // what tells you it worked, and the music underneath it
  let moves;
  if (journey.inPlace) {
    moves = [{
      when: 'Now', title: `Deepen in ${pretty(home.key)}`,
      why: `Identity and destination already share a position — the diagnosis is not distance but thin voicing. ${st.image.mode === 'minor' ? 'And the reputation carries the same position in a sour register: people see where you stand and resent the standing. That is fixed by changing how the position feels, not where it is.' : 'The strategy is consistency at a volume the category cannot ignore.'}`,
      actions: [home.design.behavior[0], home.design.voice[0]],
      signal: 'Done when the category describes you in the same words twice — consistency has become reputation.',
      music: 'Same tonic, fuller chord; the piece closes on the amen (IV → I).',
    }];
  } else if (journey.genre) {
    const g = GENRES.find((x) => x.id === journey.genre);
    const audDist = circleDistance(state.destIdx, st.audience.index);
    moves = [{
      when: 'Now',
      title: `The ${g.title.toLowerCase()} route — ${pretty(home.key)} → ${pretty(dest.key)}`,
      why: g.moveWhy + (audDist <= 1 ? ' And it lands on your people’s own ground — the room is predisposed to sing along.' : ''),
      actions: [dest.design.behavior[0], dest.design.voice[0]],
      signal: g.signal,
      music: journey.genre === 'jazz'
        ? `${pretty(dest.key)}’s ii, then the tritone substitute — the resolution delayed on purpose.`
        : `the doo-wop loop (I–vi–IV–V) in ${pretty(dest.key)}, hook first, key change last.`,
    }];
  } else {
    moves = journey.movements.map((m, i) => {
      const toA = ARCHETYPES[m.to];
      const fromA = ARCHETYPES[m.from];
      const mc = movementChords(m, { resolve: false });
      const audDist = circleDistance(m.to, st.audience.index);
      const audNote = audDist <= 1
        ? ` This ground sits beside your people’s own position — they will read the move as their own language.`
        : audDist <= 3 ? ` Your people can follow this from where they stand.` : '';
      if (m.type === 'turn') {
        return {
          when: i === 0 ? 'Now' : 'Next',
          title: `The turn — enter ${toA.name.replace('The ', 'the ')}’s grammar`,
          why: `Names are claimed last. Before ${esc(state.brandName)} calls itself ${toA.name.replace('The ', 'a ').toLowerCase()}, it behaves like one while still looking and sounding like itself — so the audience experiences the change as growth, not costume. The behaviors come first; the label rides in on them.`,
          actions: [toA.design.behavior[0], toA.design.voice[0]],
          signal: 'When the new behaviors stop reading as a campaign and start reading as policy, the name is claimable.',
          music: mc.pivotGloss,
        };
      }
      const br = m.dist === 1 ? bridgeFor(m.from, m.to) : null;
      const single = journey.movements.length === 1;
      return {
        when: i === 0 ? 'Now' : 'Next',
        title: `${single ? 'The move' : 'The bridge'} — ${pretty(fromA.key)} → ${pretty(toA.key)}`,
        why: `${single ? '' : `The stepping stone: before the destination is reachable, the brand needs ground that belongs to both worlds. `}${br ? br.principle : `Carry ${fromA.value.toLowerCase()} toward ${toA.value.toLowerCase()} through meanings both positions already own.`}${audNote}`,
        actions: [toA.design.voice[0], toA.design.behavior[0]],
        signal: `You’ve landed when outsiders start using ${toA.value.toLowerCase()}-words about you unprompted.`,
        music: mc.pivotGloss,
      };
    });
  }
  const CAD_SIGNALS = {
    authentic: 'The claim lands without pushback — nobody asks “who do they think they are.”',
    plagal: 'Nobody remembers it was ever different; the new position reads as having always been true.',
    deceptive: 'The public surprise buys the belief the old reputation couldn’t.',
  };
  moves.push({
    when: 'The claim', title: `${CADENCES[cadence].name} (${CADENCES[cadence].figure})`,
    why: `${CADENCES[cadence].reading} The reputation currently sits ${circleDistance(st.image.index, state.destIdx)} fifths from the destination — that distance is what chose this arrival.`,
    actions: [CADENCES[cadence].principle],
    signal: CAD_SIGNALS[cadence],
    music: `${CADENCES[cadence].figure} in ${pretty(dest.key)}.`,
  });

  const gov = governingGap();
  return {
    home, dest, energy, moves,
    saynot: SAYNOT[dest.id] || [],
    voiceDo: dest.design.voice,
    aesthetic: dest.design.aesthetic,
    behavior: dest.design.behavior,
    light: lightOf(energy), motion: motionOf(energy), tempo: tempoOf(energy),
    sonic: { key: `${pretty(dest.key)} ${state.destMode}`, sig: signatureChord(state.destIdx, state.destMode), cadence: CADENCES[cadence] },
    guardrails: {
      keep: `${home.gift} — the ${home.name.replace('The ', '')}’s gift travels with you; a modulation is not an amnesia.`,
      refuse: `${dest.shadow}. Every key has its minor; this is ${pretty(dest.key)}’s.`,
      watch: gov.dist >= 4 ? `${gov.name} (${INTERVAL_CLASSES[gov.dist].name}): ${INTERVAL_CLASSES[gov.dist].strategic}` : null,
    },
  };
}

RENDER.leadsheet = () => {
  const st = state.study;
  const { journey, cadence } = state.prog;
  const bars = annotateBars();
  const B = briefData();
  const A = st.identity.arch, Z = B.dest;

  const measures = bars.map((b, i) => `
    <div class="measure ${b.tag}" data-measure="${i}">
      <span class="chordsym">${b.chord.label}</span>
      <span class="roman">${b.chord.roman}${b.chord.key !== undefined ? ` <i>of ${pretty(b.chord.key)}</i>` : ''}</span>
      <span class="barnote">${b.note}</span>
    </div>`).join('');

  return `
  <section class="panel sheetpanel">
    <p class="overline">${esc(state.brandName)} · the brief</p>
    <h2 class="h2">${esc(state.brandName)}${journey.inPlace ? ` — deepening in ${pretty(A.key)}` : ` — from ${pretty(A.key)} to ${pretty(Z.key)}`}</h2>
    <p class="body">${journey.inPlace ? `${A.name}, voiced more fully.` : `${A.name} → ${Z.name} · ${journey.genre ? `the ${journey.genre} route` : journey.movements.length === 1 ? 'one movement' : 'a bridge and a turn'} · arriving on a ${CADENCES[cadence].name}.`}</p>
    <div class="btnrow tight">
      <button class="btn primary" data-act="perform">▸ perform it — ${journey.genre || 'classical'}</button>
      <button class="btn" data-act="playall">chords only</button>
      <button class="btn" data-act="copy">copy as markdown</button>
      <button class="btn" data-act="print">print / pdf</button>
    </div>
    <div class="sheet">${measures}</div>

    <h3 class="h3">The moves — how the repositioning actually works</h3>
    <div class="roadmap">
      ${B.moves.map((m) => `
        <div class="roadrow">
          <span class="roadwhen">${m.when}</span>
          <div>
            <p class="roadtitle">${m.title}</p>
            <p class="whyline">${m.why}</p>
            <ul class="dolist">${m.actions.map((a) => `<li>${a}</li>`).join('')}</ul>
            <p class="signal">You’ll know: ${m.signal}</p>
            <p class="musicnote">In the music: ${m.music}</p>
          </div>
        </div>`).join('')}
    </div>

    <h3 class="h3">Voice — say this, not that</h3>
    <div class="saynot">
      ${B.saynot.map((p) => `
        <div class="sayrow">
          <p class="saydo">“${p.say}”</p>
          <p class="saynotp">not “${p.not}”</p>
        </div>`).join('')}
    </div>
    <ul class="specbullets">${B.voiceDo.map((x) => `<li>${x}</li>`).join('')}</ul>

    <h3 class="h3">Look &amp; feel — the physics of ${pretty(Z.key)}</h3>
    <p class="body"><strong>Light:</strong> ${B.light}. <strong>Motion:</strong> ${B.motion}. ${B.energy > 0 ? `${B.energy} sharp${B.energy > 1 ? 's' : ''} — energy carried as brightness.` : B.energy < 0 ? `${-B.energy} flat${B.energy < -1 ? 's' : ''} — depth carried as warmth.` : 'No accidentals — clarity carried as restraint.'}</p>
    <ul class="specbullets">${B.aesthetic.map((x) => `<li>${x}</li>`).join('')}</ul>

    <h3 class="h3">Behavior — proof over promise</h3>
    <ul class="specbullets">${B.behavior.map((x) => `<li>${x}</li>`).join('')}</ul>

    <h3 class="h3">Sound — the sonic direction</h3>
    <p class="body">The brand sounds in <strong>${B.sonic.key}</strong>. Signature chord: <strong>${B.sonic.sig.label}</strong> — ${B.sonic.sig.gloss}. Arrivals resolve by <strong>${B.sonic.cadence.name}</strong> (${B.sonic.cadence.figure}); tempo ${B.tempo}. Hand this sentence to a composer and they can begin.</p>

    <h3 class="h3">Guardrails</h3>
    <div class="keepshadow">
      <p class="body"><strong>Carry from home:</strong> ${B.guardrails.keep}</p>
      <p class="body"><strong>The shadow to refuse:</strong> ${B.guardrails.refuse}</p>
      ${B.guardrails.watch ? `<p class="body"><strong>Standing watch:</strong> ${B.guardrails.watch}</p>` : ''}
    </div>

    <div class="btnrow">
      <button class="btn ghost" data-act="refutures">← choose a different future</button>
      <button class="btn" data-act="notes">field notes</button>
      <button class="btn ghost" data-act="again">begin another study</button>
    </div>
    <p class="printfoot">brand harmonics — strategy you can hear</p>
  </section>`;
};

WIRE.leadsheet = () => {
  const highlightBar = (i) => {
    qa('.measure').forEach((m) => m.classList.remove('playing'));
    const el = q(`[data-measure="${i}"]`);
    if (el) { el.classList.add('playing'); el.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); }
  };
  q('[data-act=perform]').onclick = () => {
    const genre = state.prog.journey.genre || 'classical';
    const piece = composePiece(state.prog.bars, genre);
    audio.playPiece(piece, {
      onBar: highlightBar,
      onDone: () => qa('.measure').forEach((m) => m.classList.remove('playing')),
    });
  };
  q('[data-act=playall]').onclick = () => {
    const bars = state.prog.bars;
    qa('.measure').forEach((m) => m.classList.remove('playing'));
    audio.playProgression(bars.map((b) => playable(b.chord)), {
      secondsPerChord: bars.length > 14 ? 1.35 : 1.7,
      onStep: (i) => {
        qa('.measure').forEach((m) => m.classList.remove('playing'));
        const el = q(`[data-measure="${i}"]`);
        if (el) { el.classList.add('playing'); el.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); }
      },
      onDone: () => qa('.measure').forEach((m) => m.classList.remove('playing')),
    });
  };
  q('[data-act=copy]').onclick = (e) => {
    const text = exportMarkdown();
    const done = () => {
      e.target.textContent = 'copied ✓';
      setTimeout(() => { e.target.textContent = 'copy as markdown'; }, 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  };
  q('[data-act=print]').onclick = () => window.print();
  q('[data-act=refutures]').onclick = () => setScreen('futures');
  q('[data-act=notes]').onclick = () => { state.cameFrom = 'leadsheet'; setScreen('notes'); };
  q('[data-act=again]').onclick = () => setScreen('setup');
};

/* ---- field notes --------------------------------------------------- */
RENDER.notes = () => `
  <section class="panel narrow">
    <p class="overline">field notes</p>
    <h2 class="h2">How the map works</h2>
    ${METHODOLOGY.map((m) => `<h3 class="h3">${m.h}</h3><p class="body">${m.p}</p>`).join('')}
    <h3 class="h3">The twelve, assigned</h3>
    <div class="maptable">
      ${ARCHETYPES.map((a) => `
        <div class="maprow">
          <span class="mkey">${pretty(a.key)}</span>
          <span class="mname">${a.name} <i>· ${a.value.toLowerCase()}</i></span>
          <span class="mlore">${a.keyLore}</span>
        </div>`).join('')}
    </div>
    <p class="backlink"><button type="button" class="linkbtn" data-act="back">← return</button></p>
  </section>`;

WIRE.notes = () => { q('[data-act=back]').onclick = () => setScreen(state.cameFrom || 'landing'); };

/* ---- markdown export ----------------------------------------------- */
function exportMarkdown() {
  const st = state.study;
  const bars = annotateBars();
  const B = briefData();
  const s1 = st.square.s1, s2 = st.square.s2;
  const L = [];
  L.push(`# ${state.brandName} — the brief`, '');
  L.push(`*A semiotic study in twelve keys · ${B.home.name} (${pretty(B.home.key)}) → ${B.dest.name} (${pretty(B.dest.key)})*`, '');
  L.push(`## The territory`, '');
  L.push(`Core opposition: **${s1.term}** (${byId[s1.id].name}) vs **${s2.term}** (${byId[s2.id].name}).`, '');
  L.push(`## The four positions`, '');
  LENS_ORDER.forEach((l) => {
    const d = LENSES.find((x) => x.id === l);
    L.push(`- **${d.title}** — ${st[l].arch.name}, ${st[l].arch.keyLabel.replace(' major', '')} ${modeWord(st[l].mode)}. ${st[l].arch[posLine[l]]}`);
  });
  L.push('', `## The intervals`, '');
  [...state.gaps].sort((a, b) => b.dist - a.dist).forEach((g) => {
    const ic = INTERVAL_CLASSES[g.dist];
    L.push(`- **${g.name}** (${pretty(st[g.a].arch.key)} ↔ ${pretty(st[g.b].arch.key)}, ${ic.name}) — ${ic.strategic}`);
  });
  L.push('', `## The progression`, '');
  L.push(bars.map((b) => b.chord.label).join(' | '), '');
  L.push(bars.map((b) => `\`${b.chord.label}\` — ${b.note}`).join('\n'), '');
  L.push(`## The moves`, '');
  B.moves.forEach((m) => {
    L.push(`### ${m.when} — ${m.title}`, '', m.why, '');
    m.actions.forEach((a) => L.push(`- ${a}`));
    L.push(`- **You'll know:** ${m.signal}`);
    L.push(`- *In the music:* ${m.music}`, '');
  });
  L.push('', `## Voice — say this, not that`, '');
  B.saynot.forEach((p) => L.push(`- Say: “${p.say}” — not: “${p.not}”`));
  B.voiceDo.forEach((x) => L.push(`- ${x}`));
  L.push('', `## Look & feel — the physics of ${pretty(B.dest.key)}`, '');
  L.push(`Light: ${B.light}. Motion: ${B.motion}.`);
  B.aesthetic.forEach((x) => L.push(`- ${x}`));
  L.push('', `## Behavior — proof over promise`, '');
  B.behavior.forEach((x) => L.push(`- ${x}`));
  L.push('', `## Sound`, '');
  L.push(`Key: ${B.sonic.key}. Signature chord: ${B.sonic.sig.label} (${B.sonic.sig.gloss}). Cadence: ${B.sonic.cadence.name} (${B.sonic.cadence.figure}). Tempo: ${B.tempo}.`);
  L.push('', `## Guardrails`, '');
  L.push(`- **Carry from home:** ${B.guardrails.keep}`);
  L.push(`- **The shadow to refuse:** ${B.guardrails.refuse}`);
  if (B.guardrails.watch) L.push(`- **Standing watch:** ${B.guardrails.watch}`);
  L.push('', `_brand harmonics — strategy you can hear_`);
  return L.join('\n');
}

/* ---- utilities ----------------------------------------------------- */
const q = (sel) => stage.querySelector(sel);
const qa = (sel) => [...stage.querySelectorAll(sel)];

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
  ta.remove();
}

/* ---- go ------------------------------------------------------------ */
stage.innerHTML = RENDER.landing();
WIRE.landing();
armReveals();
window.__harmonics = state; // inspectable from the console; harmless in production
