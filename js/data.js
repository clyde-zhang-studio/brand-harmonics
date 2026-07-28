/* =====================================================================
   data.js — the theory of the piece, written down.

   Twelve archetypes mapped onto the twelve keys of the circle of
   fifths. The mapping is designed, not decorative: adjacency on the
   circle = kinship of meaning; the tritone (opposite point) = each
   archetype's true contrary. Key "characters" are cultural codes
   (Schubart 1806, folk practice, Romantic usage) — chosen and cited,
   the way a semiotician chooses a code and says so.
   ===================================================================== */

/* ---- the wheel ----------------------------------------------------
   index = position on the circle of fifths, clockwise from C.
   Read around the ring and it tells a cycle:
   purity → wandering → belonging → desire → play → mastery →
   transgression → transformation → creation → care → order →
   wisdom → and wisdom simplifies back into purity.               */

export const ARCHETYPES = [
  {
    id: 'innocent', name: 'The Innocent', epithet: 'the open chord',
    key: 'C', keyLabel: 'C major', accidentals: 'no sharps, no flats',
    value: 'Purity',
    essence: 'Believes the good thing is simple, and the simple thing is good.',
    drive: 'safety through simplicity; a world that keeps its promises',
    gift: 'clarity, trust, morning light',
    shadow: 'denial — simplicity maintained by refusing to know things',
    keyLore:
      'Schubart (1806) called C major "completely pure — innocence, simplicity, naïveté." A key with nothing to hide and nothing added: every note on the white keys. The Innocent is the brand equivalent: no accidentals.',
    chord: { suffix: '', notes: [0, 4, 7, 12], gloss: 'a plain triad with the octave — nothing hidden, nothing withheld' },
    audienceLine: 'They reward brands that make life feel safe, legible and light. Complication reads as deceit.',
    imageLine: 'People describe it as wholesome, clean, a little naive — the brand equivalent of a white t-shirt.',
    aspirationLine: 'Becoming the Innocent means subtraction as strategy: fewer promises, kept absolutely.',
    design: {
      voice: ['Short declarative sentences; no subordinate clauses doing secret work.', 'Say the price, the ingredient, the catch — first, not in footnotes.', 'Warmth without irony; irony is experience, and the Innocent has none.'],
      aesthetic: ['White space as a material, not a gap. Daylight palettes, unmixed color.', 'One typeface, generous size, nothing condensed.', 'Photography in natural light; no dramatic grading.'],
      behavior: ['Default settings are the honest settings.', 'Remove one step from every flow each quarter.', 'Never make forgiveness a feature tier: returns, refunds, do-overs are free.'],
    },
  },
  {
    id: 'explorer', name: 'The Explorer', epithet: 'one note past the horizon',
    key: 'G', keyLabel: 'G major', accidentals: 'one sharp',
    value: 'Discovery',
    essence: 'Believes the self is found on the far side of the fence.',
    drive: 'freedom, unfenced ground, the next ridge',
    shadow: 'aimlessness — motion mistaken for meaning',
    gift: 'independence, appetite, fresh air',
    keyLore:
      'Schubart heard G major as "everything rustic and idyllic" — the outdoors key. It is C with one sharp: the Innocent’s world plus a single raised note, which is exactly what a horizon is.',
    chord: { suffix: 'add9', notes: [0, 4, 7, 14], gloss: 'a triad with the ninth added — one tone reaching past the chord’s edge' },
    audienceLine: 'They reward brands that equip rather than instruct, and despise anything that fences them in.',
    imageLine: 'People describe it as restless, outdoorsy, a little solitary — gear for lives other people wish they led.',
    aspirationLine: 'Becoming the Explorer means selling the door, not the room: every touchpoint points outward.',
    design: {
      voice: ['Second person, present tense: you, now, out there.', 'Name real places and real weather; abstraction is a wall.', 'Invitations, never itineraries.'],
      aesthetic: ['Horizon lines in layout: low anchors, tall skies of space.', 'Terrain palettes — slate, moss, dust — with one signal color like a tent on a hillside.', 'Maps, marks and waypoints as a graphic language.'],
      behavior: ['Build for offline, for edges, for weak signal — literally and figuratively.', 'Reward leaving the app / store / feed; the brand is a trailhead, not a destination.', 'Ship tools that work without accounts.'],
    },
  },
  {
    id: 'everyman', name: 'The Everyman', epithet: 'the session key',
    key: 'D', keyLabel: 'D major', accidentals: 'two sharps',
    value: 'Belonging',
    essence: 'Believes ordinary life, done together, is the whole point.',
    drive: 'to belong without auditioning',
    gift: 'solidarity, plainness, the common table',
    shadow: 'facelessness — belonging bought by sanding off every edge',
    keyLore:
      'D major is the folk session key — the key of open fiddle strings, barn dances and pub singalongs, playable by anyone who shows up. (Schubart heard triumph in D; we side with the fiddlers. Key characters are codes, and we choose the folk code — the methodology says why.)',
    chord: { suffix: '(open)', notes: [0, 7, 12, 16], gloss: 'root, fifth, octave, third — the open-string voicing anyone’s hands can find' },
    audienceLine: 'They reward brands that respect their money and their intelligence, and distrust anything that smells of velvet rope.',
    imageLine: 'People describe it as decent, dependable, unremarkable — furniture of ordinary life.',
    aspirationLine: 'Becoming the Everyman means the courage to be plain: no mystique, just reliability with manners.',
    design: {
      voice: ['Words your neighbor uses; if a sentence would sound odd said across a fence, cut it.', 'Humor that laughs with, never at.', 'Price talk is plain talk — no "investment," no "curation."'],
      aesthetic: ['Sturdy grids, medium weights, nothing precious.', 'Colors from the hardware store and the kitchen, not the runway.', 'Real people at real angles; retouch nothing but red-eye.'],
      behavior: ['One fair price; loyalty means the deal gets better, not the pitch.', 'Design every flow for the busiest week of a normal life.', 'Support answered by humans who are allowed to say sorry.'],
    },
  },
  {
    id: 'lover', name: 'The Lover', epithet: 'the leaning interval',
    key: 'A', keyLabel: 'A major', accidentals: 'three sharps',
    value: 'Desire',
    essence: 'Believes attention is the rarest gift, and gives it entirely.',
    drive: 'closeness, beauty, being chosen',
    gift: 'intimacy, sensuous intelligence, devotion to the particular',
    shadow: 'need — desire that grips instead of beholds',
    keyLore:
      'Schubart: A major is the key of "declarations of innocent love … hope of seeing one’s beloved again." The tender-bright key, three sharps in: far enough from plain C to feel like candlelight.',
    chord: { suffix: 'maj7', notes: [0, 4, 7, 11], gloss: 'the major seventh — the interval that leans in and does not resolve, because it does not want to leave' },
    audienceLine: 'They reward brands that notice details about them, and punish anything generic as a small betrayal.',
    imageLine: 'People describe it as gorgeous, sensory, a little much — you remember how it felt, not what it said.',
    aspirationLine: 'Becoming the Lover means choosing fewer people and adoring them: depth of attention as the moat.',
    design: {
      voice: ['Write to one person, never to a segment.', 'Sensory verbs — warm, hold, taste — over evaluative ones — premium, elevated.', 'Silence is a register: the Lover does not fill every pause.'],
      aesthetic: ['Materials first: texture, weight, grain, finish — even on screens.', 'Deep warm palettes; light like late afternoon.', 'Close crops and shallow focus; the beloved fills the frame.'],
      behavior: ['Remember preferences without being asked twice.', 'Unbox, onboard and greet as rituals, not steps.', 'Anniversaries over acquisitions: mark time spent together.'],
    },
  },
  {
    id: 'jester', name: 'The Jester', epithet: 'the grace note',
    key: 'E', keyLabel: 'E major', accidentals: 'four sharps',
    value: 'Play',
    essence: 'Believes nothing true was ever said with a straight face.',
    drive: 'joy now; the puncture of every inflated thing',
    gift: 'levity, honesty smuggled in laughter, permission',
    shadow: 'frivolity — the joke that dodges every consequence',
    keyLore:
      'Schubart: E major is "noisy shouts of joy, laughing pleasure." Four sharps of glitter. The Jester lives here, one bright step below the Hero — the dare before the deed.',
    chord: { suffix: '6/9', notes: [0, 4, 9, 14], gloss: 'the six-nine chord — sweet, unresolved, grinning; jazz’s way of ending on a wink' },
    audienceLine: 'They reward brands that refuse solemnity, and share anything that makes them look funny for finding it.',
    imageLine: 'People describe it as the funny one — beloved, quoted, and suspected of being unserious.',
    aspirationLine: 'Becoming the Jester means using laughter as a crowbar: the joke opens what the pitch cannot.',
    design: {
      voice: ['The joke lands only if the information does; comedy is a delivery mechanism, not a substitute.', 'Puncture yourself first — self-importance is the only forbidden register.', 'Timing over volume: one great line beats five loud ones.'],
      aesthetic: ['Primary-adjacent colors with one deliberately wrong accent.', 'Type that can raise an eyebrow — but never more than one novelty face per surface.', 'Motion with comic timing: anticipation, snap, settle.'],
      behavior: ['Hide one delightful, useless thing in every release.', 'Error states are stages: the 404 should be worth screenshotting.', 'Never gate the fun behind the funnel.'],
    },
  },
  {
    id: 'hero', name: 'The Hero', epithet: 'the arrival chord',
    key: 'B', keyLabel: 'B major', accidentals: 'five sharps',
    value: 'Action',
    essence: 'Believes the world is improved by effort, and proof is a duty.',
    drive: 'mastery demonstrated; the record broken',
    gift: 'courage, discipline, the raised bar',
    shadow: 'ruthlessness — winning that forgets what it was for',
    keyLore:
      'Schubart heard B major as "strongly coloured … wild passions." Five sharps — the brightest, most effortful key before the circle breaks over into flats. Everything about B major is earned.',
    chord: { suffix: 'sus4 → maj', notes: [0, 5, 7, 12], resolveNotes: [0, 4, 7, 12], gloss: 'a suspension resolving to the triad — tension held, then the arrival; the Hero’s whole story in two chords' },
    audienceLine: 'They reward brands that measure things and win things, and discard anything that flinches from a benchmark.',
    imageLine: 'People describe it as intense, impressive, exhausting — the brand that turns everything into a personal best.',
    aspirationLine: 'Becoming the Hero means publishing the scoreboard: name the enemy (the old way), post the numbers.',
    design: {
      voice: ['Verbs of work: build, lift, ship, hold. Adjectives must earn their place with a number.', 'Name the hard part out loud; ease is the competitor’s pitch.', 'Address the reader as capable — never coddle.'],
      aesthetic: ['High contrast, hard edges, compressed type set tight.', 'One triumphal accent — gold, signal red — used like a medal, rarely.', 'Documentary grit over gloss: chalk dust, worn tools, real sweat.'],
      behavior: ['Progress is always visible: streaks, deltas, personal records.', 'Make the product measurably better every cycle and publish the delta.', 'Celebrate user victories louder than product launches.'],
    },
  },
  {
    id: 'outlaw', name: 'The Outlaw', epithet: 'diabolus in musica',
    key: 'F#', keyLabel: 'F# major', accidentals: 'six sharps — the far point',
    value: 'Transgression',
    essence: 'Believes every rule is a wall someone built to keep something for themselves.',
    drive: 'to break what deserves breaking',
    gift: 'liberation, honesty about power, voltage',
    shadow: 'destruction for its own sake — the fire that forgets what it was clearing',
    keyLore:
      'F# sits a tritone from C — the interval medieval theorists shunned as diabolus in musica, the devil in the music: the exact far point from innocence. And yet Schubart heard F# major as "triumph over difficulty, the free sigh when hurdles are surmounted" — which is precisely the Outlaw’s promise: rules are hurdles.',
    chord: { suffix: '7#9', notes: [0, 4, 10, 15], gloss: 'the Hendrix chord — a major and minor third sounding at once, the rulebook torn in half and both halves played' },
    audienceLine: 'They reward brands that say the unsayable thing about the category, and can smell borrowed rebellion instantly.',
    imageLine: 'People describe it as dangerous, thrilling or juvenile, depending on who is asked — nobody says "fine."',
    aspirationLine: 'Becoming the Outlaw means picking the right enemy: transgression without a named injustice is just noise.',
    design: {
      voice: ['Name the racket: say plainly who profits from the way things are.', 'Short, kinetic, declarative. No hedging modifiers — "quite" is surrender.', 'Never punch down; the Outlaw’s license comes from punching up.'],
      aesthetic: ['Break one design law per surface — grid, casing, margin — and obey the rest with discipline.', 'Black, plus one color at full voltage.', 'Xerox textures, torn edges, stencil and scrawl over polish.'],
      behavior: ['Refuse a profitable industry norm in public — dark patterns, junk fees, fake urgency — and post the receipt.', 'Ship the feature the incumbents’ lawyers would veto.', 'Side with users against gatekeepers even when it costs quarterly.'],
    },
  },
  {
    id: 'magician', name: 'The Magician', epithet: 'the veil key',
    key: 'Db', keyLabel: 'D♭ major', accidentals: 'five flats',
    value: 'Transformation',
    essence: 'Believes reality is a draft, and knows where the pen is.',
    drive: 'to turn one thing into another; the moment of change itself',
    gift: 'vision, catalysis, the shiver of the possible',
    shadow: 'manipulation — transformation performed on people instead of for them',
    keyLore:
      'Schubart called D♭ "a leering key, degenerating into grief and rapture" — the twilight key, where one thing shades into another. Five flats deep: the world seen from inside the change.',
    chord: { suffix: 'maj7#11', notes: [0, 4, 11, 18], gloss: 'a lydian shimmer — the raised eleventh, the note that isn’t supposed to be there, sounding like it always was' },
    audienceLine: 'They reward brands that produce before-and-after gaps that feel physically impossible, and forgive opacity if the trick keeps working.',
    imageLine: 'People describe it with the word "somehow" — nobody can quite explain it, which is either the appeal or the accusation.',
    aspirationLine: 'Becoming the Magician means selling the transformation, never the mechanism — but rigging nothing.',
    design: {
      voice: ['Speak in before/after; the mechanism stays backstage, the outcome downstage.', 'Verbs of transmutation: turn, become, unlock — used precisely.', 'A register of calm certainty; wonder in the user’s mouth, not the brand’s.'],
      aesthetic: ['Twilight palettes — indigo, violet, mercury — and gradients as a native material.', 'Reveals over statements: interfaces that draw back curtains.', 'Light as a substance: glow, refraction, aurora.'],
      behavior: ['Compress the distance from intention to result until it feels like sleight of hand.', 'Stage one moment of astonishment in the first five minutes.', 'Power asymmetry is real: publish an ethics of what the trick will never do.'],
    },
  },
  {
    id: 'creator', name: 'The Creator', epithet: 'the dream key',
    key: 'Ab', keyLabel: 'A♭ major', accidentals: 'four flats',
    value: 'Originality',
    essence: 'Believes the unmade thing is a debt owed to the world.',
    drive: 'to give form; to see the inner thing exist outside',
    gift: 'imagination, craft, standards no client asked for',
    shadow: 'perfectionism — the work protected from the world by never finishing',
    keyLore:
      'A♭ is the key Romantic pianists reached for to write dreams down — Liszt’s Liebesträume, Chopin’s nocturnes. Schubart, darker, called it the key of the grave and eternity. Every maker knows the blank page is both.',
    chord: { suffix: 'maj9', notes: [0, 4, 11, 14], gloss: 'a major ninth — the triad with its overtones composed in, the chord as a small finished work' },
    audienceLine: 'They reward tools and objects that respect the work, and resent anything that treats making as content.',
    imageLine: 'People describe it as the tasteful one — admired, imitated, occasionally accused of caring more about the object than the customer.',
    aspirationLine: 'Becoming the Creator means the portfolio is the argument: ship fewer things, finish them completely.',
    design: {
      voice: ['Show the process — sketches, rejects, tolerances; craft narrated is craft proved.', 'Precision vocabulary: name the material, the method, the measurement.', 'No superlatives; let specificity do the bragging.'],
      aesthetic: ['A visible system — grid, scale, tokens — worn like joinery, not hidden.', 'Studio palettes: paper, graphite, linen, one pigment.', 'The object photographed like sculpture: raking light, honest shadows.'],
      behavior: ['Changelogs written like artist statements.', 'Expose the making: open files, specs, teardowns.', 'Sell the tool and the blank page together — every customer is treated as a maker.'],
    },
  },
  {
    id: 'caregiver', name: 'The Caregiver', epithet: 'the lullaby chord',
    key: 'Eb', keyLabel: 'E♭ major', accidentals: 'three flats',
    value: 'Devotion',
    essence: 'Believes strength exists to be lent.',
    drive: 'to protect, provision and hold',
    gift: 'trustworthiness, patience, the made bed and the kept vigil',
    shadow: 'smothering — help that quietly needs to be needed',
    keyLore:
      'Schubart: E♭ major is "the key of love, of devotion, of intimate conversation with God." Three flats, three of anything sacred. The warmest register of the flat side.',
    chord: { suffix: '6', notes: [0, 4, 7, 9], gloss: 'the added sixth — the doo-wop lullaby ending, resolution softened so it can be leaned on' },
    audienceLine: 'They reward brands that show up in the hard week, and never forgive being upsold at a vulnerable moment.',
    imageLine: 'People describe it as kind, safe, maternal — and, when it slips, as hovering.',
    aspirationLine: 'Becoming the Caregiver means designing for the worst day: the 3 a.m. version of every flow.',
    design: {
      voice: ['Reassure with specifics — what happens next, who is handling it, when.', 'The imperative mood is banned in hard moments; offer, never order.', 'Read every sentence as if to someone frightened; rewrite what fails.'],
      aesthetic: ['Blanket palettes: wool, cream, dusk blue; contrast gentle but legible.', 'Rounded geometry that still looks competent — a nurse’s handwriting, not a nursery.', 'Illustration over photography where dignity is at risk.'],
      behavior: ['The escalation path to a human is never more than one step.', 'Remember what they told you; asking twice is a small abandonment.', 'Build the unprofitable feature that only matters in emergencies.'],
    },
  },
  {
    id: 'ruler', name: 'The Ruler', epithet: 'the processional key',
    key: 'Bb', keyLabel: 'B♭ major', accidentals: 'two flats',
    value: 'Order',
    essence: 'Believes chaos is a tax on everyone, and order is a gift you administer.',
    drive: 'stewardship; the system that outlives its architect',
    gift: 'stability, standards, the long view',
    shadow: 'control — order maintained for the throne’s sake',
    keyLore:
      'B♭ is the processional key — the pitch of brass bands, anthems and state occasions; the instruments of ceremony are built in it. Schubart adds: "cheerful love, clear conscience, aspiration for a better world" — rule at its best.',
    chord: { suffix: '', notes: [-12, 0, 7, 16], gloss: 'the triad over a doubled bass root — weight underneath, the chord as a foundation stone' },
    audienceLine: 'They reward institutions that are boring in the right places, and defect at the first sign of improvisation with their stakes.',
    imageLine: 'People describe it as established, authoritative, a little cold — the one you choose when it matters and complain about after.',
    aspirationLine: 'Becoming the Ruler means acting like infrastructure: predictable, accountable, built for decades.',
    design: {
      voice: ['Institutional first person plural — we hold, we guarantee — backed by named accountability.', 'No exclamation marks; authority does not raise its voice.', 'Precision about obligations: what is promised, to whom, by when.'],
      aesthetic: ['Symmetry, generous margins, capital letterforms with real serifs or none at all.', 'Civic palettes: navy, stone, forest, bronze.', 'Insignia over logo: a mark that could be carved.'],
      behavior: ['Publish the standard you hold yourself to; invite audit.', 'Change slowly and announce early; surprise is a failure of governance.', 'Take responsibility upward — the institution absorbs blame, never deflects it.'],
    },
  },
  {
    id: 'sage', name: 'The Sage', epithet: 'the withheld third',
    key: 'F', keyLabel: 'F major', accidentals: 'one flat',
    value: 'Wisdom',
    essence: 'Believes the truth, patiently found, is the only durable kindness.',
    drive: 'understanding; the world made intelligible',
    gift: 'judgment, calm, the long study',
    shadow: 'detachment — knowing as a way of never touching',
    keyLore:
      'Schubart: F major is "complaisance and calm" — the pastoral key, one flat, one step of remove from plain C. Beethoven put the Pastoral symphony here: contemplation with its boots off. Note the wheel’s last move: the Sage sits beside the Innocent — wisdom, completed, simplifies back into clarity.',
    chord: { suffix: '5(add9)', notes: [0, 7, 14, 19], gloss: 'open fifths with the ninth — a chord with the third withheld: conclusions left for you to draw' },
    audienceLine: 'They reward being shown the working, and treat every unsupported claim as a small insult.',
    imageLine: 'People describe it as credible, rigorous, slightly aloof — cited in arguments, forgotten at parties.',
    aspirationLine: 'Becoming the Sage means teaching as marketing: publish what you know until the category thinks in your terms.',
    design: {
      voice: ['Claims arrive holding their evidence — data, method, margin of error.', 'Calm syntax; no urgency theater, no countdown clocks.', 'Concede counterarguments before the reader raises them.'],
      aesthetic: ['Editorial typography: real hierarchy, footnotes treated as first-class.', 'Library palettes: ivory, ink, oxide green.', 'Diagrams as the hero image; a chart is worth a headline.'],
      behavior: ['Publish the research, including the inconvenient result.', 'Explain every recommendation; "trust us" is never the interface.', 'Version your positions publicly and show what changed your mind.'],
    },
  },
];

export const byId = Object.fromEntries(ARCHETYPES.map((a, i) => [a.id, { ...a, index: i }]));
export const indexOf = (id) => byId[id].index;

/* ---- the four quadrants (contiguous arcs of three) --------------- */
export const QUADRANTS = [
  { name: 'the open',  members: ['sage', 'innocent', 'explorer'], gloss: 'the independent registers — clarity, freedom, the horizon' },
  { name: 'the near',  members: ['everyman', 'lover', 'jester'],  gloss: 'the registers of belonging — the table, the beloved, the laugh' },
  { name: 'the forge', members: ['hero', 'outlaw', 'magician'],   gloss: 'the registers of force — effort, rupture, transmutation' },
  { name: 'the keep',  members: ['creator', 'caregiver', 'ruler'],gloss: 'the registers of keeping — the made thing, the held person, the standing order' },
];

/* ---- the six oppositions (tritone pairs = semiotic contraries) ----
   Each axis yields a semiotic square: S1 vs S2 (contraries),
   ~S1 and ~S2 (their contradictories, the "not-" positions).      */

export const AXES = [
  {
    a: 'innocent', b: 'outlaw',
    s1: 'Purity', s2: 'Transgression',
    nots1: 'the knowing', nots2: 'the proper',
    gloss: 'the unbroken thing vs. the deliberately broken one',
    statements: {
      identity:   ['We win by being the thing with nothing to hide.', 'We win by breaking a rule the category treats as sacred.'],
      audience:   ['They want life made cleaner, lighter, safer.', 'They want someone to say the forbidden thing out loud.'],
      image:      ['Outsiders call it wholesome — maybe a little naive.', 'Outsiders call it provocative — maybe a little dangerous.'],
      aspiration: ['Its best future is radical simplicity, promises kept absolutely.', 'Its best future is naming the racket and refusing to run it.'],
    },
  },
  {
    a: 'sage', b: 'hero',
    s1: 'Wisdom', s2: 'Action',
    nots1: 'the untested', nots2: 'the at-rest',
    gloss: 'knowing the world vs. forcing it to move',
    statements: {
      identity:   ['We are trusted because we understand things others don’t.', 'We are trusted because we perform under conditions others can’t.'],
      audience:   ['They want to be shown the working before they believe.', 'They want to be pushed past what they thought was their limit.'],
      image:      ['Outsiders call it rigorous — cited, credible, a bit aloof.', 'Outsiders call it intense — impressive, relentless, a bit much.'],
      aspiration: ['Its best future is becoming the category’s teacher.', 'Its best future is becoming the category’s champion.'],
    },
  },
  {
    a: 'explorer', b: 'magician',
    s1: 'Discovery', s2: 'Transformation',
    nots1: 'the settled', nots2: 'the fixed',
    gloss: 'finding what is out there vs. changing what is here',
    statements: {
      identity:   ['We open territory: new ground, new markets, new air.', 'We change states: what enters as one thing leaves as another.'],
      audience:   ['They want equipment for a bigger life out there.', 'They want to be different on the other side of the purchase.'],
      image:      ['Outsiders call it restless — always somewhere else by launch day.', 'Outsiders say "somehow" a lot — nobody can explain quite how it works.'],
      aspiration: ['Its best future is the trailhead: the door to what’s next.', 'Its best future is the catalyst: before-and-after as the product.'],
    },
  },
  {
    a: 'everyman', b: 'creator',
    s1: 'Belonging', s2: 'Originality',
    nots1: 'the set-apart', nots2: 'the standard',
    gloss: 'fitting in among vs. standing out from',
    statements: {
      identity:   ['We are for everyone, priced and worded like it.', 'We are for the ones who notice the details no one else builds.'],
      audience:   ['They want to buy without auditioning for it.', 'They want objects and tools that treat them as makers.'],
      image:      ['Outsiders call it dependable and unremarkable — furniture of daily life.', 'Outsiders call it the tasteful one — admired, imitated, a little precious.'],
      aspiration: ['Its best future is the common table, set for everyone.', 'Its best future is the studio whose output defines the standard.'],
    },
  },
  {
    a: 'lover', b: 'caregiver',
    s1: 'Desire', s2: 'Devotion',
    nots1: 'the unmoved', nots2: 'the unheld',
    gloss: 'the love that wants vs. the love that tends',
    statements: {
      identity:   ['We seduce: attention, beauty, the feeling of being chosen.', 'We tend: protection, patience, the feeling of being held.'],
      audience:   ['They want to be desired — noticed in particular, not in general.', 'They want to be looked after — especially on the worst day.'],
      image:      ['Outsiders call it gorgeous and a little extra.', 'Outsiders call it kind and a little careful.'],
      aspiration: ['Its best future is depth: fewer people, adored completely.', 'Its best future is trust: the one they call at 3 a.m.'],
    },
  },
  {
    a: 'jester', b: 'ruler',
    s1: 'Play', s2: 'Order',
    nots1: 'the grave', nots2: 'the loose',
    gloss: 'the licensed fool vs. the standing law',
    statements: {
      identity:   ['We are the ones who refuse to be solemn about any of it.', 'We are the ones who keep the system standing so others can relax.'],
      audience:   ['They reward wit and share it; solemnity loses them.', 'They reward reliability and audit it; improvisation loses them.'],
      image:      ['Outsiders call it the funny one — and wonder if it’s serious.', 'Outsiders call it the institution — and wish it would loosen up.'],
      aspiration: ['Its best future is court jester to the category: the only one allowed to tell the truth laughing.', 'Its best future is infrastructure: boring in the right places for decades.'],
    },
  },
];

/* ---- the four lenses (enunciative positions) --------------------- */
export const LENSES = [
  {
    id: 'identity', title: 'Where the brand is', short: 'Identity',
    poetic: 'the note it actually sounds',
    prompt: 'Answer as the brand’s own conscience — what is true of it today, not what the deck says.',
    valence: {
      q: 'And this identity, held today —',
      major: 'is held with conviction; the brand believes itself', minor: 'is worn thin; the brand performs itself',
      majorShort: 'held with conviction', minorShort: 'worn thin',
    },
  },
  {
    id: 'audience', title: 'Where the customers are', short: 'Audience',
    poetic: 'the note the room is humming',
    prompt: 'Answer as the people you actually serve — their values, not their demographics.',
    valence: {
      q: 'And between the brand and these people —',
      major: 'the distance is closing; they are moving toward each other', minor: 'the distance is opening; they are drifting apart',
      majorShort: 'moving closer', minorShort: 'drifting apart',
    },
  },
  {
    id: 'image', title: 'What people believe it to be', short: 'Image',
    poetic: 'the note that echoes back',
    prompt: 'Answer as an outsider describing the brand at a dinner party — reputation, not intention.',
    valence: {
      q: 'And this reputation, on balance —',
      major: 'flatters the brand; the echo is kind', minor: 'wounds the brand; the echo distorts',
      majorShort: 'the echo is kind', minorShort: 'the echo distorts',
    },
  },
  {
    id: 'aspiration', title: 'Where it can be', short: 'Aspiration',
    poetic: 'the note it is reaching for',
    prompt: 'Answer for the brand’s best plausible future — worth wanting and actually reachable.',
    valence: {
      q: 'And this future, honestly —',
      major: 'feels within reach; a matter of will', minor: 'feels like a leap; a matter of faith',
      majorShort: 'within reach', minorShort: 'a leap of faith',
    },
  },
];

/* ---- interval diagnostics (distance on the circle, 0–6) ---------- */
export const INTERVAL_CLASSES = [
  { dist: 0, name: 'unison', musical: 'the same key — no friction, total agreement', strategic: 'aligned. The risk is not tension but redundancy: sameness this complete stops generating information.' },
  { dist: 1, name: 'a fifth apart', musical: 'neighboring keys sharing six of seven notes — the strongest consonance that is still two different places', strategic: 'productive kinship. Nearly everything is shared; the one note of difference is exactly where the energy is.' },
  { dist: 2, name: 'two fifths apart', musical: 'a whole step between tonics — close relatives; modulation needs only a chord or two', strategic: 'within reach. The gap is legible and crossable; a season of consistent signals closes it.' },
  { dist: 3, name: 'three fifths apart', musical: 'a bright strain — audibly related, audibly not the same place', strategic: 'real tension. Ignorable in good times, expensive in bad; left alone it reads as inconsistency.' },
  { dist: 4, name: 'four fifths apart', musical: 'distant keys — few shared chords; getting there takes deliberate staging', strategic: 'a genuine gap. No single gesture crosses it; only a sequence read in order.' },
  { dist: 5, name: 'five fifths apart', musical: 'estranged keys — barely any common material; adjacent moves feel foreign', strategic: 'estrangement. The positions no longer explain each other; each makes the other look false.' },
  { dist: 6, name: 'the tritone', musical: 'the far point of the circle — diabolus in musica, maximal harmonic distance', strategic: 'the crisis interval. These positions are semiotic contraries: each is the other’s negation. Unmanaged it reads as hypocrisy; composed, it is the most powerful tension a brand can hold.' },
];

/* unison with split modes: the same position, heard in shadow */
export const SHADOW_GAP = {
  name: 'the parallel minor',
  musical: 'the same tonic, but one side sounds in minor — the third darkened, everything else in place',
  strategic: 'the positions agree on where the brand stands and disagree on how it feels to stand there. This is not a repositioning problem; it is a re-voicing problem: same note, brighter third. Change the experience of the position, not the position.',
};

/* the six pairwise gaps between the four positions */
export const GAP_DEFS = [
  { a: 'identity', b: 'image',      name: 'the authenticity gap', question: 'Do you appear as you are?' },
  { a: 'identity', b: 'audience',   name: 'the resonance gap',    question: 'Do you share your people’s values?' },
  { a: 'audience', b: 'image',      name: 'the reception gap',    question: 'Is what they see what they came for?' },
  { a: 'identity', b: 'aspiration', name: 'the ambition interval',question: 'How far are you actually reaching?' },
  { a: 'image', b: 'aspiration',    name: 'the credibility gap',  question: 'Will the move be believed?' },
  { a: 'audience', b: 'aspiration', name: 'the permission gap',   question: 'Will they follow you there?' },
];

/* ---- bridges: the twelve adjacent transitions -------------------- */
/* key: 'fromId>toId' clockwise; used in both directions with shared ground */
export const BRIDGES = {
  'innocent>explorer': { shared: 'trust in the world', principle: 'The Innocent’s trust becomes the Explorer’s courage: someone who believes the world is good will walk into it. Keep the honesty; point it at a horizon.' },
  'explorer>everyman': { shared: 'the open road meets the town', principle: 'Every trail ends at a table. The Explorer’s discoveries become the Everyman’s common goods: what was found out there is shared here, without ceremony.' },
  'everyman>lover': { shared: 'closeness', principle: 'Belonging deepens into intimacy: the crowd resolves into one face. Keep the plainness; aim it at a single person at a time.' },
  'lover>jester': { shared: 'delight', principle: 'Pleasure brightens into play. The Lover’s attention to what feels good becomes the Jester’s permission to enjoy it out loud.' },
  'jester>hero': { shared: 'nerve', principle: 'The dare becomes the deed. The Jester’s fearlessness about looking foolish is the raw material of the Hero’s fearlessness about failing.' },
  'hero>outlaw': { shared: 'refusal of limits', principle: 'The will to win hardens into the will to break. The Hero fights within the rules until the rules themselves are revealed as the opponent.' },
  'outlaw>magician': { shared: 'the broken opening', principle: 'Transgression matures into transformation: what was torn open becomes a doorway. The energy of "no" becomes the power of "become."' },
  'magician>creator': { shared: 'the shaping hand', principle: 'Transformation settles into craft. The Magician’s change-of-state becomes the Creator’s made object: wonder, given permanence.' },
  'creator>caregiver': { shared: 'making for someone', principle: 'The made thing finds its recipient. Craft becomes care the moment the maker asks who will hold this, and on what kind of day.' },
  'caregiver>ruler': { shared: 'responsibility', principle: 'Care scales into stewardship: one held person becomes a system that holds everyone. The vigil becomes the institution.' },
  'ruler>sage': { shared: 'the long view', principle: 'Power ripens into wisdom — the philosopher-king’s move. Authority earns the right to teach by explaining itself, then teaching becomes the authority.' },
  'sage>innocent': { shared: 'clarity', principle: 'Wisdom, completed, simplifies. The Sage’s ten thousand pages resolve into the Innocent’s one true sentence — a second innocence, on the far side of knowing.' },
};

/* ---- cadences: how an arrival lands ------------------------------ */
export const CADENCES = {
  authentic: {
    name: 'authentic cadence', figure: 'V7 → I',
    reading: 'the decisive claim: dominant to tonic, the most conclusive arrival in the language. Use when the world is ready to believe you.',
    principle: 'Announce the repositioning explicitly — a flagship act that only the new position could perform, launched at full volume.',
  },
  plagal: {
    name: 'plagal cadence', figure: 'IV → I',
    reading: 'the amen: an arrival by settling rather than insistence. Use when the audience is already humming the note you are moving to.',
    principle: 'Do not announce — confirm. Let the repositioning surface as a series of quiet proofs until one day it is simply true and no one remembers otherwise.',
  },
  deceptive: {
    name: 'deceptive cadence', figure: 'V7 → vi, then V7 → I',
    reading: 'the earned arrival: promise the resolution, land somewhere unexpected, then resolve for real. Use when credibility is the scarce resource.',
    principle: 'Subvert before you claim: publicly do the thing your reputation says you never would. The surprise buys the belief; then make the true move.',
  },
};

/* ---- valence (mode) gloss ---------------------------------------- */
export const MODE_GLOSS = {
  major: 'major — the position sounds in its open, daylight form',
  minor: 'minor — the position sounds in shadow: same tonic, darkened third; the archetype’s cost is audible in it',
};

/* ---- presets: three fictional brands for the demo ride ----------- */
/* answers: per lens — six axis picks (side 'a'|'b', strength 1|2 in axis order) + valence */
export const PRESETS = [
  {
    id: 'meridian', name: 'Meridian & Sons', sector: 'a 190-year-old private bank',
    blurb: 'Impeccable, resented, and quietly aware that its clients’ heirs feel nothing for it. The institution wants to learn to speak.',
    answers: {
      identity:   { axes: [{ side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 2 }], valence: 'major' },
      audience:   { axes: [{ side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 2 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }], valence: 'minor' },
      image:      { axes: [{ side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 2 }], valence: 'minor' },
      aspiration: { axes: [{ side: 'a', strength: 2 }, { side: 'a', strength: 2 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }], valence: 'major' },
    },
  },
  {
    id: 'glimmer', name: 'Glimmer', sector: 'a five-year-old skincare company',
    blurb: 'Founded on gentle honesty, adored for its jokes, and dreaming of becoming a transformation company. The distance is farther than the founders think.',
    answers: {
      identity:   { axes: [{ side: 'a', strength: 2 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }], valence: 'major' },
      audience:   { axes: [{ side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 2 }, { side: 'a', strength: 1 }], valence: 'major' },
      image:      { axes: [{ side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 2 }], valence: 'major' },
      aspiration: { axes: [{ side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 2 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }], valence: 'minor' },
    },
  },
  {
    id: 'foldworks', name: 'Foldworks', sector: 'an AI workflow company',
    blurb: 'Ships miracles weekly, described by the press with the word "unsettling," used daily by people who joke about it nervously. Wants to be trusted the way a library is trusted.',
    answers: {
      identity:   { axes: [{ side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 2 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }], valence: 'major' },
      audience:   { axes: [{ side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 2 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }], valence: 'minor' },
      image:      { axes: [{ side: 'b', strength: 2 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'a', strength: 1 }, { side: 'a', strength: 1 }], valence: 'minor' },
      aspiration: { axes: [{ side: 'a', strength: 2 }, { side: 'a', strength: 2 }, { side: 'a', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }, { side: 'b', strength: 1 }], valence: 'major' },
    },
  },
];

/* ---- methodology (the field notes screen) ------------------------ */
export const METHODOLOGY = [
  {
    h: 'Why a circle, twice',
    p: 'There are twelve brand archetypes and twelve keys on the circle of fifths, and both are genuinely circular: archetypes shade into their neighbors, and neighboring keys share six of their seven notes. This study maps one wheel onto the other so that conceptual distance becomes harmonic distance — something you can hear. Adjacent archetypes sound like kin. Opposed archetypes sit a tritone apart: the interval medieval theory nicknamed diabolus in musica and treated as the point of maximal tension.',
  },
  {
    h: 'The wheel is an argument',
    p: 'Read clockwise from C: purity opens into wandering; the road leads to the town; belonging deepens into desire; pleasure brightens into play; the dare becomes the deed; winning hardens into breaking; rupture matures into transformation; transformation settles into craft; making becomes making-for; care scales into stewardship; power ripens into wisdom; and wisdom simplifies back into purity. Twelve fifths that close a circle of meaning as well as one of pitch.',
  },
  {
    h: 'A deliberate heresy',
    p: 'Mark & Pearson’s wheel opposes its quadrants by motivation (independence against belonging, stability against mastery). This wheel is built instead from pairwise contraries, because the semiotic square runs on contraries: each archetype’s tritone is its strongest negation. Innocent–Outlaw, Sage–Hero, Explorer–Magician, Everyman–Creator, Lover–Caregiver, Jester–Ruler. The fool sits opposite the king; eros opposite agape. The quadrants survive as neighborhoods — the open, the near, the forge, the keep — but the axes are semiotic, not motivational.',
  },
  {
    h: 'Key characters are codes, and we say so',
    p: 'Nothing acoustic makes E♭ devoted or B wild — equal temperament flattened those differences centuries ago. Key character is folklore: Schubart’s 1806 catalogue, folk-session practice, the habits of Romantic pianists and brass bands. That folklore is exactly the kind of shared cultural code semiotics studies, so this map borrows it openly and chooses among its readings — Schubart’s where they fit (C’s innocence, E♭’s devotion, A’s declarations of love), the fiddlers’ D over Schubart’s where they conflict. A myth chosen knowingly is a methodology; a myth chosen silently is just branding.',
  },
  {
    h: 'The square beneath the music',
    p: 'The study reads four positions of one brand — identity (where it is), audience (where its people are), image (what it is believed to be), aspiration (where it could go). The identity’s governing value and that value’s contrary generate a Greimas square: value, counter-value, and their two negations. All four positions are plotted onto this territory — horizontally by which pole they serve, vertically by how fully they assert it — and each resolves to a key. From there, everything is intervals.',
  },
  {
    h: 'Strategy as modulation',
    p: 'A brand cannot leap from C to F♯ without losing the room; music solved this problem four hundred years ago. You modulate: move through pivot chords that belong to both the key you are leaving and the key you are entering — meanings both positions already share. Moving sharpward brightens by effort (each step raises a new leading tone: a genuinely new capability). Moving flatward relaxes by reframing (your old tonic is reheard as the new key’s dominant: existing equity becomes the setup for the next position). The final cadence is chosen by credibility: announce (authentic), settle (plagal), or subvert first and then resolve (deceptive). The strategy ships as a lead sheet — chords above, principles below.',
  },
];

/* ---- the five movements: strategic glosses ----------------------- */
/* {dest} and {key} are filled at render with the actual destination */
export const MOVE_GLOSSES = {
  hold: 'Stay and deepen. The position is right but thinly held — the strategy is consistency at a volume the category can’t ignore. If the reputation has soured, change how the position feels, not where it stands. (In the music: same note, fuller chord.)',
  dominant: 'Build one visible new capability and let it raise the brand’s energy. The confident step upward: do the new thing in public and stake the claim on it. (In the music: one fifth up — a single new sharp.)',
  subdominant: 'Reframe what you already own as the doorway to {dest}. Nothing new to build — the move is maturity and warmth, told entirely through existing equity. (In the music: one fifth down — your home chord becomes the door.)',
  relative: 'Recompose: same assets, new emotional center. Every code the brand owns already belongs to {dest} — recenter the story there and you get differentiation without a rebrand. (In the music: the relative key — an identical signature.)',
  tritone: 'Become the category’s contrary. Maximum differentiation, minimum initial belief — it only works if you publicly subvert your own reputation first, then claim the new ground. (In the music: the tritone, the far side of the wheel.)',
};

/* ---- the three genre routes -------------------------------------- */
export const GENRES = [
  {
    id: 'jazz', title: 'Jazz', tagline: 'tension, on purpose',
    gloss: 'The dissonant route — leap all the way to {dest} and hold the clash until the room leans in. Jazz doesn’t resolve early: the surprising move is the argument, and the arrival lands because you made them wait. Highest differentiation, hardest sell — the fun kind of wrong. (In the music: the destination’s ii, then a tritone substitute — the “wrong” chord that’s secretly right.)',
    moveWhy: 'This route treats your reputation as material to play against. The brand does the unexpected thing loudly, sustains the discomfort past the point a cautious brand would apologize, and resolves only once the category has leaned in to listen. The dissonance is not a cost — it is the content.',
    signal: 'When the tension you struck on purpose starts being quoted as the point — the clash has become identity.',
  },
  {
    id: 'classical', title: 'Classical', tagline: 'movement without a seam',
    gloss: 'The composed route — one step to {dest}, modulated so smoothly nobody can point to the moment it changed. Every move travels through material both positions already share, so credibility never breaks. (In the music: pivot-chord modulation, resolved by the book.)',
    moveWhy: 'This route never asks the audience to forgive a jump. Each gesture is prepared by the last, each new note shared with the old key, and the reposition is only visible in hindsight — the brand seems to have grown, not turned.',
    signal: 'When someone describes the new position as what you always were — the seam is invisible.',
  },
  {
    id: 'pop', title: 'Pop', tagline: 'the hook, repeated',
    gloss: 'The hook route — go where your people already are and say it simply enough to be repeated. Simplicity is the strategy: four chords, no cleverness, and a key change for the last chorus. (In the music: the doo-wop loop — I, vi, IV, V — in {dest}’s key.)',
    moveWhy: 'This route optimizes for transmission. One idea, said catchily, repeated without variation until the audience does the repeating for you. Complexity is the enemy; the chorus is the strategy deck.',
    signal: 'When strangers repeat the hook back to you unchanged — the audience has taken over distribution.',
  },
];

/* ---- voice, made concrete: say this, not that -------------------- */
export const SAYNOT = {
  innocent: [
    { say: 'It works. It costs twelve dollars.', not: 'Our revolutionary solution unlocks holistic value.' },
    { say: 'Nothing in here you can’t pronounce.', not: 'Formulated with our proprietary complex.' },
  ],
  explorer: [
    { say: 'The road doesn’t care about your inbox.', not: 'Everything you need, all in one place.' },
    { say: 'Works at −20°, four days from a socket.', not: 'Seamless connectivity, wherever life takes you.' },
  ],
  everyman: [
    { say: 'Fair price. Decent coffee. Open at six.', not: 'An elevated experience, curated for the discerning.' },
    { say: 'Built to be fixed, not replaced.', not: 'Indulge yourself — you deserve luxury.' },
  ],
  lover: [
    { say: 'Made for the second glass, not the first sip.', not: 'Optimized for maximum user satisfaction.' },
    { say: 'We remembered — it’s the one you wore in Lisbon.', not: 'Recommended for you based on your browsing history.' },
  ],
  jester: [
    { say: 'Terms and conditions apply. They’re actually funny.', not: 'We take fun seriously.' },
    { say: 'Our 404 page has a fan club.', not: 'Delight is one of our five core values.' },
  ],
  hero: [
    { say: 'Add ten kilos. Then we’ll talk.', not: 'Comfort you’ll absolutely love.' },
    { say: 'Tested at altitude. Numbers published.', not: 'Engineered for peak performance.' },
  ],
  outlaw: [
    { say: 'The fee everyone charges you? Gone. It was rent.', not: 'A fresh take on a classic category.' },
    { say: 'Banned in three trade associations.', not: 'Boldly disrupting the industry.' },
  ],
  magician: [
    { say: 'Forty minutes becomes four. Watch.', not: 'Leveraging AI to streamline workflows.' },
    { say: 'You walk in tired. You walk out someone who slept.', not: 'A transformative wellness journey.' },
  ],
  creator: [
    { say: 'Third prototype. The hinge finally disappears.', not: 'Designed with meticulous attention to detail.' },
    { say: 'Open file. Steal it. Make it better.', not: 'Unleash your creativity.' },
  ],
  caregiver: [
    { say: 'Someone answers at 3 a.m. Her name is on the page.', not: 'Your call is important to us.' },
    { say: 'The refund is already on its way.', not: 'Customer satisfaction is our top priority.' },
  ],
  ruler: [
    { say: 'Audited annually. Findings published, including the bad one.', not: 'Trusted by millions worldwide.' },
    { say: 'The standard since 1907. Amended twice, explained both times.', not: 'Committed to excellence and integrity.' },
  ],
  sage: [
    { say: 'Here’s the data, the method, and the two places we’re unsure.', not: 'Studies show it simply works.' },
    { say: 'We changed our position. Here’s what changed it.', not: 'The science is settled — trust the experts.' },
  ],
};

/* ---- ui strings --------------------------------------------------- */
export const APP = {
  title: 'harmonics',
  tagline: 'a semiotic study of brands, in twelve keys',
  landing: [
    'Every brand is a claim about meaning, and every claim has a sound.',
    'Some brands are in tune with the people they serve. Some are one sharp away and call it strategy. Some are a tritone from their own reputation and call it mystery.',
    'This study locates a brand four times — as it is, as its people are, as it is believed to be, as it could be — sets each position ringing in its proper key, and composes the way home.',
  ],
};
