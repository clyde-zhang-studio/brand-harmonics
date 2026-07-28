# Publishing this site

The site is plain static files — no build step, no dependencies, no server code. Anything that can serve a folder over HTTPS can host it.

## Current home

GitHub Pages, from the `main` branch of this repo:

> **https://clyde-zhang-studio.github.io/brand-harmonics/**

## First-time setup (once)

1. **Create the repo.** At <https://github.com/new>: name it `brand-harmonics`, set it **Public** (GitHub Pages needs a public repo on a free plan), and do **not** add a README, .gitignore, or licence — this folder already has them.

2. **Push this folder.** From `brand-harmonics/`:

   ```bash
   git remote add origin https://github.com/clyde-zhang-studio/brand-harmonics.git
   git push -u origin main
   ```

   Git will ask for a username and password. The password is **not** your GitHub password — it's a Personal Access Token from <https://github.com/settings/tokens> (Generate new token → classic → tick `repo` → copy it). macOS stores it in the Keychain afterwards, so this is a one-time cost.

3. **Turn on Pages.** Repo → **Settings** → **Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → **Save**. The first build takes about a minute.

## Publishing updates (every time after)

```bash
git add -A && git commit -m "what changed" && git push
```

Pages redeploys within a minute or so. Hard-refresh (⌘⇧R) if you still see the old version.

## If you host it somewhere else

Four absolute URLs are hard-coded for link previews and must match wherever it lives — all four are in the marked block near the top of `index.html`:

- `<link rel="canonical">`
- `og:url`
- `og:image`
- `twitter:image`

`404.html` also links back to `/brand-harmonics/`; change that if the path differs. Nothing else in the site uses absolute paths, so it runs correctly from a domain root or any subfolder.

## Custom domain

In Settings → Pages, add the domain and create a `CNAME` DNS record pointing at `clyde-zhang-studio.github.io`. Then update the four URLs above. Leave *Enforce HTTPS* on.

## What's in here

| File | Purpose |
| --- | --- |
| `index.html` | the site — entry point, metadata, atmosphere layers |
| `css/style.css` | the whole visual system |
| `js/*.js` | theory engine, scoring, audio, composer, drawing, screen flow |
| `og.png` | 1200×630 social preview card |
| `favicon.svg`, `apple-touch-icon.png` | icons |
| `404.html` | branded not-found page |
| `.nojekyll` | stops GitHub Pages running Jekyll over the files |
| `harmonics-onefile.html` | the whole app inlined into one file — opens by double-click, no server |

## Working on it locally

ES modules don't load over `file://`, so use a server:

```bash
python3 -m http.server 8431
```

Then open <http://localhost:8431>. (Or just double-click `harmonics-onefile.html`, which needs nothing.)
