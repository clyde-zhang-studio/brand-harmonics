# brand harmonics

*A semiotic study of brands, in twelve keys.*

**→ [cownut-oss.github.io/brand-harmonics](https://cownut-oss.github.io/brand-harmonics/)**

An interactive study that locates a brand four times — **as it is** (identity), **as its people are** (audience), **as it is believed to be** (image), **as it could be** (aspiration) — sets each position ringing in its proper musical key, and composes the repositioning as a chord progression you can actually hear played. The final deliverable is a creative brief: the lead sheet, the moves, say-this-not-that voice, look and feel, and guardrails.

Built as a single-page site with **no dependencies and no build step** — plain HTML, CSS, and ES modules, including a hand-written piano and drum kit on the Web Audio API. Serve the folder statically and it runs forever.

## Run it

```bash
python3 -m http.server 8431
# then open http://localhost:8431
```

Any static server works — ES modules need `http://`, not `file://`. Or just double-click `harmonics-onefile.html`, which is the whole app inlined into a single file and needs nothing at all.

Publishing and updating the live site: see [DEPLOY.md](DEPLOY.md).

## The idea

Three systems are mapped onto each other:

1. **The semiotic square** (Greimas/Floch). The brand's governing value and its contrary generate a territory — value, counter-value, and their negations. All four brand positions are plotted inside it: horizontally by which pole they serve, vertically by how fully they assert it.

2. **The twelve archetypes** (after Mark & Pearson, deliberately re-axed). Arranged on a wheel built from *pairwise contraries* rather than motivational quadrants, because the semiotic square runs on contraries: each archetype's strongest negation sits directly opposite. Innocent–Outlaw, Sage–Hero, Explorer–Magician, Everyman–Creator, Lover–Caregiver (eros/agape), Jester–Ruler (the fool and the king).

3. **The circle of fifths.** Twelve archetypes, twelve keys — mapped so that kinship of meaning equals harmonic kinship. Neighboring keys share six of seven notes; opposed archetypes sit a tritone apart, the interval medieval theory called *diabolus in musica*. The Innocent gets C major (Schubart, 1806: "completely pure — innocence, simplicity"); the Outlaw lands on F♯, the tritone from innocence. Each archetype's shadow expression is its parallel minor.

From there, everything is intervals:

- The distance between any two of the four positions is a **diagnosis** — identity a fifth from image is a brand slightly ahead of its reputation; a tritone is an identity crisis; the same key split major/minor is an accurate but resented reputation (a re-voicing problem, not a repositioning problem).
- The wheel then turns **generative**: from the identity's key, harmony proposes five doors — **Hold** (deepen in place), **Sharpen** (the dominant move, +1 fifth: a new capability built in public), **Warm** (the subdominant move, −1: existing equity re-heard as the door), **Recompose** (the relative door, +3: same key signature, so every owned asset already belongs there), **Invert** (the tritone: become the contrary). Each door is scored for reach, audience earshot, and credibility; the questionnaire's stated ambition is tested against the menu rather than obeyed.
- The journey to any door is never more than **a bridge and a turn**: one movement toward an intermediate key chosen to pass nearest the audience, then entry through the destination's own ii–V — its grammar adopted before its name is claimed. The arrival cadence is chosen by the credibility gap: announce (authentic), settle (plagal), or subvert first and then resolve (deceptive).
- The output is a **brief**, not a poem: the lead sheet, the moves (Now / Next / The claim), say-this-not-that voice pairs, a look-and-feel derived from the key's physics (sharps as brightness, flats as warmth), behavior proofs, a one-sentence sonic direction a composer could start from, and guardrails.

The full mapping, with a written rationale per key and its sources (Schubart's key characters, folk-session practice, Romantic usage), lives in the app under **field notes**.

## Structure

```
index.html          shell + atmosphere layers
css/style.css       the visual system (night gradient, blooms, grain; print styles)
js/data.js          the theory as data: archetypes, axes, bridges, cadences, copy
js/theory.js        music engine: keys, diatonic chords, journey planner, progressions
js/scoring.js       assessment answers → archetype vectors → square coordinates
js/audio.js         Web Audio synth: chords, polychords (the audible gaps), sequencer
js/wheel.js         circle-of-fifths SVG
js/square.js        semiotic square SVG
js/app.js           screens, flow, written-output assembly, lead sheet, export
```

`data.js`, `theory.js`, and `scoring.js` are DOM-free and can be tested headlessly.

## Provenance

Key "characters" are cultural codes, not acoustics — equal temperament flattened any real difference centuries ago. The map borrows that folklore openly and says which reading it privileges and why. A myth chosen knowingly is a methodology; a myth chosen silently is just branding.
