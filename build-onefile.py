#!/usr/bin/env python3
"""Regenerate harmonics-onefile.html — the whole app inlined into one file.

The site itself has no build step; this only produces the optional
single-file copy (useful as an email attachment, or to open by
double-click with no server). Run it after editing anything in js/ or css/:

    python3 build-onefile.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
ORDER = ['data.js', 'theory.js', 'scoring.js', 'audio.js', 'composer.js',
         'wheel.js', 'square.js', 'app.js']

# audio.js exports are addressed as `audio.*` by app.js; inlining flattens the
# module scope, so re-create that namespace by hand.
AUDIO_SHIM = ('const audio = { playChord, playPolychord, playTetrad, '
              'playProgression, playPiece, stopAll };\n')

parts = []
for name in ORDER:
    src = (ROOT / 'js' / name).read_text()
    src = re.sub(r'(?m)^import[^;]*;\s*\n', '', src)   # drop import statements
    src = re.sub(r'(?m)^export ', '', src)             # `export const` -> `const`
    parts.append(f'/* {"=" * 20} {name} {"=" * 20} */\n{src}')
    if name == 'audio.js':
        parts.append(AUDIO_SHIM)

css = (ROOT / 'css' / 'style.css').read_text()

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Brand Harmonics — strategy you can hear</title>
<meta name="description" content="An interactive semiotic study of brands: twelve brand archetypes mapped onto the twelve keys of the circle of fifths." />
<!-- Self-contained by design: no network requests at all, so the display face
     falls back to Georgia and the text face to the system UI font. -->
<style>
{css}
</style>
</head>
<body>
<div id="haze" aria-hidden="true">
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
</div>
<div id="vignette" aria-hidden="true"></div>
<div id="grain" aria-hidden="true"></div>
<main id="stage"></main>
<div id="announcer" role="status" aria-live="polite" class="visually-hidden"></div>
<noscript>
  <div style="max-width:680px;margin:12vh auto;padding:32px;border:2.5px solid #241b10;border-radius:10px;background:#fffdf4;box-shadow:6px 6px 0 #241b10;font-family:Georgia,serif">
    <h1 style="font-style:italic;font-weight:400;margin:0 0 .4em">Brand Harmonics</h1>
    <p style="line-height:1.7">This study is an interactive instrument — it needs JavaScript to plot the semiotic square, sound the circle of fifths, and compose the progression. Please enable JavaScript and reload.</p>
  </div>
</noscript>
<script>
{''.join(parts)}
</script>
</body>
</html>
"""

out = ROOT / 'harmonics-onefile.html'
out.write_text(html)
print(f'wrote {out.name}: {len(html):,} bytes from {len(ORDER)} modules + style.css')
