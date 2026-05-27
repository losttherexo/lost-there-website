# lost,there — Vite client

The lost,there artist site, reworked into a **media-installation**: the homepage is an interactive 3D holographic **topographic map** that doubles as navigation and stays as a persistent backdrop behind every section. (Migrated CRA → Vite first; see history below.) Deploys to Vercel. **Active work is on branch `feat/topo-nav`.**

## Stack

- **Vite 5** + **React 18** (JSX)
- **React Router v6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, CSS-first config — no `tailwind.config.js`)
- **Inter** (Google Fonts, placeholder typeface)
- **three 0.160** + **@react-three/fiber 8** + **@react-three/drei 9** — the 3D topographic map (React-18-compatible majors; do NOT bump to fiber 9 / drei 10, which require React 19)

## The 3D map (home + navigation) — current direction

The site is becoming a **media installation**: the homepage is a full-viewport **holographic topographic map** that doubles as the navigation, and it stays as a **persistent backdrop** behind every section. See `src/components/scene/`.

- **`Atlas.jsx`** — the r3f `<Canvas>`. Mounted **once in `Layout`** (fixed, `z-0`) so it persists across routes. Holds the camera rig, responsive fov, terrain, and the section pins.
- **`Terrain.jsx`** — a large plane displaced by fbm noise, drawn with a **contour-line shader** (glowing iso-elevation lines + faint surface fill, `fwidth` AA, distance fade). Animated by **two interfering traveling waves** that pulse line brightness (`uTime`). Tunables in the fragment shader: `uInterval` (line density — `0.4` portrait / `0.22` landscape), the wave block, and the alpha `(line * (1.05 + crest*2.2) + 0.12)`. Colour `#84a7cf`.
- **`terrainHeight.js`** — the shared height function (fbm) so pins sit exactly on the surface; `SIZE/SEGMENTS/HEIGHT` live here too.
- **`Markers.jsx`** — the section pins: a glowing beam + a focusable `<button>` label (drei `<Html>`). Hover pulses beam+label brightness. Clicking navigates. **Coordinates come from `sections.js`** (separate desktop vs portrait layouts).
- **`sections.js`** — single source of the 5 section coordinates (`SECTIONS_DESKTOP`, `SECTIONS_PORTRAIT`), used by both the pins and the camera.

**Camera (route-driven, in `Atlas`'s `CameraRig`):**
- **Overview (home, `activeTo === null`)** — mouse-driven (window-level mouse, so it keeps following even over DOM labels), low horizon-leaning tilt, ~±9° parallax, no auto-rotate. Pins visible.
- **Section (`activeTo === '/music'…`)** — eases the camera down to that coordinate and holds, contours receding behind; section content fades in over a scrim. Pins hidden.
- **Reduced-motion** holds a fixed view and freezes the wave/parallax.

**Portrait** has its own marker layout + framing (higher fov cap, look-down `-30`, fog far `130`, horizon near the top); landscape uses denser contour lines to match the look.

**Navigation model:** no nav bar. The map navigates via its **pins**; once inside a section a **`SectionMenu`** (corner icon → slide-in drawer) jumps between sections / home. Persistent **`lost,there` title** (top-left, home link) + **footer** on every page.

## Design system (foundation)

A restrained, themeable base — **not** the final visual identity. All tokens live in the `@theme {}` block of `src/index.css`; changing a token re-themes every utility built from it.

**Two swap points re-skin most of the site:**
- **Typeface** — `--font-sans` in `src/index.css` + the `<link>` in `index.html`. Currently Inter; swap when identity is locked.
- **Accent** — `--color-accent` (+ `--color-accent-contrast`). Currently a muted slate-blue; one line to change everywhere it's used (focus rings, active nav, CTAs).

**Color tokens** (off-black canvas → off-white ink, faintly cool, deliberately not pure #000/#fff). Each generates `bg-/text-/border-/ring-` utilities:

| Token | Hex | Use | Utility example |
|-------|-----|-----|-----------------|
| `--color-canvas` | `#0b0b0c` | page background | `bg-canvas` |
| `--color-surface` | `#141416` | raised panel / card | `bg-surface` |
| `--color-elevated` | `#1d1d20` | hover / nested surface | `bg-elevated` |
| `--color-line` | `#2a2a2e` | hairline borders, dividers | `border-line` |
| `--color-ink` | `#f4f4f5` | primary text | `text-ink` |
| `--color-muted` | `#a1a1aa` | secondary text | `text-muted` |
| `--color-faint` | `#71717a` | tertiary / placeholder | `text-faint` |
| `--color-accent` | `#6b8fb5` | focus, active nav, CTA | `bg-accent` / `border-accent` / `ring-accent` |
| `--color-accent-contrast` | `#0b0b0c` | text on the accent | `text-accent-contrast` |

**Type** — custom scale (`text-xs`…`text-7xl`) with generous body line-heights and tight heading leading; weight carries hierarchy. `h1–h3` get `tracking-tight` + `text-balance` from the base layer.

**Spacing rhythm** — Tailwind's default 0.25rem step. Page convention: horizontal gutter via the **`shell`** utility (`max-w-6xl mx-auto px-4 sm:px-6`); section vertical padding `py-12` (compact) / `py-16` (default) / `py-24+` (hero).

**Global focus** — one `:focus-visible` rule in the base layer puts an accent ring on every interactive element (no per-component ring classes needed).

**Nav** — there is no nav bar (see "The 3D map" above): the map navigates via pins, and `components/SectionMenu.jsx` is a corner-icon slide-in drawer on section pages (closes on route change / Escape / backdrop). Skip-to-content link still wired to `#main`.

## Run

```bash
cd client
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

## Deploy (Vercel)

Live target: **lostthere.online** (replacing the old `lostthere.netlify.app`).

**Repo settings on Vercel (do once):**
- **Root Directory:** `client` (the repo root holds both `client/` and `server/`; the site is the client).
- **Framework Preset:** Vite (auto-detected).
- **Build Command:** `npm run build` · **Output Directory:** `dist` · **Install:** `npm install`.
- Pushes to the connected branch auto-deploy. PRs/other branches get preview URLs.

**`vercel.json`** (in `client/`) adds the SPA fallback — without it, hard-loading a deep route like `/music` 404s because there's no `index.html` at that path:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
(Static assets in `dist/` are matched by the filesystem first, so the rewrite only catches client-side routes.)

**DNS — Namecheap → Vercel.** Both `lostthere.online` and `www.lostthere.online` are attached to the Vercel project. In Namecheap: *Domain List → Manage → Advanced DNS*. Remove the default parking records (`CNAME www → parkingpage`, any `URL Redirect`/`A @ → parking`), then add what Vercel's CLI asked for:

| Type | Host  | Value         | TTL       |
|------|-------|---------------|-----------|
| `A`  | `@`   | `76.76.21.21` | Automatic |
| `A`  | `www` | `76.76.21.21` | Automatic |

(`www` can alternatively be a `CNAME` → `cname.vercel-dns.com.` — pick one, not both.) Vercel auto-verifies and issues the TLS cert once DNS resolves. Check with `dig lostthere.online +short` and `dig www.lostthere.online +short` (both expect `76.76.21.21`), or https://dnschecker.org. Propagation is usually minutes, up to a few hours.

**Pre-launch splash.** A "coming soon" gate (`src/pages/ComingSoon.jsx`) renders for the public until launch; the gate lives in `src/comingSoon.js` and is wired in `App.jsx`.
- **Default:** on in production, off during local `npm run dev`.
- **Toggle without a code change:** Vercel env var `VITE_COMING_SOON` = `"true"` | `"false"`.
- **Preview the real site behind it:** add `?preview=1` to the URL (persists per-browser via localStorage; `?preview=0` re-locks).
- **To launch for good:** set `VITE_COMING_SOON="false"` **and** remove the `noindex` meta below.

**Search indexing:** `index.html` carries `<meta name="robots" content="noindex,nofollow">` so the placeholder site doesn't get indexed while the splash is up. **Remove it at launch, together with the splash toggle.**

## What was migrated

- **CRA → Vite.** `react-scripts` removed; `vite` + `@vitejs/plugin-react` added. `vite.config.js` registers the React and Tailwind plugins.
- **Entry point.** `public/index.html` → project-root `index.html` (Vite convention). `%PUBLIC_URL%` placeholders stripped. `<script type="module" src="/src/main.jsx">` added explicitly.
- **File renames.** All `.js` files containing JSX renamed to `.jsx` (Vite requires this for JSX transform by default). `src/index.js` → `src/main.jsx`.
- **Routing.** `react-router-dom@5` (`<Switch>` + child `<Route>`) → `react-router-dom@6` (`<Routes>` + `element={<Page/>}` prop). Layout route wraps all pages.
- **Tailwind 3 → 4.** Old `@tailwind base/components/utilities` directives replaced with `@import "tailwindcss";`. Theme tokens now declared in CSS via `@theme {}`. `tailwind.config.js` removed (v4 auto-detects content).
- **Google Analytics tag** (`G-8ENZEMQLBG`) carried into the new `index.html`.

## What was removed

- `react-scripts`, `@testing-library/*`, `web-vitals`, `querystring-es3`, `@babel/plugin-proposal-private-property-in-object` (all CRA-era).
- `tailwind.config.js` (Tailwind v4 doesn't need it).
- `src/app.css` (Tailwind directives consolidated into `src/index.css`).
- CRA placeholder assets: `public/logo192.png`, `public/logo512.png`, `public/manifest.json`, `public/robots.txt`, the CRA-generic `<noscript>` boilerplate.
- Old `build/` and `dist/` output folders.
- All 7 original components were retired in favor of the new structure:
  - `NavBar.jsx`, `Landing.jsx`, `Tour.jsx`, `TourDate.jsx`, `About.jsx`, `Blog.jsx`, `Newsletter.jsx`
- The `/blog` route (not in the 6-page spec).
- The Newsletter modal (no backend in scope; signup intent now lives on `/contact`).
- The lime-500-on-black palette of the old site (visual identity to be redefined later).
- The `"tailwindtutorial"` package name (renamed to `"lostthere"`).

## What was preserved

- `favicon.ico` (and `theme-color` meta).
- Google Analytics tag.
- The site title (`lost,there`) and the conceptual structure of a NavBar with a mobile drawer — pattern reimplemented cleanly inside `<Layout>`.
- The shape of the old `tourDates` array, generalized into the Shows-page upcoming list.

## Architecture

```
client/
├─ index.html              ← Vite entry (project root)
├─ vite.config.js
├─ public/
│  └─ favicon.ico
└─ src/
   ├─ main.jsx             ← ReactDOM.createRoot + BrowserRouter
   ├─ App.jsx              ← <Routes> w/ Layout wrapper
   ├─ index.css            ← Tailwind import + @theme + base styles
   ├─ comingSoon.js        ← pre-launch gate logic (toggle + ?preview bypass)
   ├─ components/
   │  ├─ Layout.jsx        ← hosts the 3D backdrop + scrim + title + footer + SectionMenu
   │  ├─ SectionMenu.jsx   ← corner-icon slide-in drawer (section pages only)
   │  ├─ Placeholder.jsx   ← labeled wireframe box
   │  ├─ Embed.jsx         ← provider-aware embed wrapper (Spotify/SoundCloud/untitled/yt…)
   │  ├─ ReleaseCard.jsx   ← release grid card; cover cross-dissolves into the player
   │  └─ scene/            ← the 3D map (see "The 3D map" section)
   │     ├─ Atlas.jsx      ← <Canvas>: camera rig, responsive fov, route-driven
   │     ├─ Terrain.jsx    ← contour-shader heightfield + traveling-wave animation
   │     ├─ Markers.jsx    ← section pins (beam + <Html> label button)
   │     ├─ sections.js    ← the 5 section coordinates (desktop + portrait layouts)
   │     └─ terrainHeight.js ← shared fbm height fn + SIZE/SEGMENTS/HEIGHT
   ├─ data/
   │  └─ releases.js       ← editable release data (real lost,there catalog)
   ├─ hooks/
   │  └─ useDocumentTitle.js ← per-route <title> + <meta name="description">
   └─ pages/
      ├─ Home.jsx           ← renders null — IS the map overview (backdrop lives in Layout)
      ├─ Music.jsx          ← BUILT: Releases grid; owns the open-player state
      ├─ Shows.jsx          ← wireframe
      ├─ Lab.jsx            ← wireframe
      ├─ About.jsx          ← wireframe (dual-purpose: fan bio + press kit)
      ├─ Contact.jsx        ← wireframe
      ├─ ComingSoon.jsx     ← pre-launch splash
      └─ NotFound.jsx
```

## Components

- **`<Embed provider url title height fill />`** — the one embed primitive for the whole site. Builds the iframe src per provider (`spotify` / `soundcloud` / `untitled` / `apple` / `bandcamp` / `youtube`) from a normal share URL; empty `url` → a labeled placeholder box. `fill` stretches it to the parent (used inside the card's square). Reuse for every embed slot (release players, TD reel, previz).
- **`<ReleaseCard release isOpen onOpen />`** — controlled card: square cover (or placeholder tile) + title/year/type. Clicking the cover **cross-dissolves in place** into the `<Embed>` player (fixed square, no layout shift, `motion-reduce` safe). Open/close is owned by the Music page, not the card.
- **Music player state** — `Music.jsx` holds `openId` so **one player is open at a time** (opening one closes any other). It closes on a click outside any card, on **Escape**, or on **tab-hide** (`visibilitychange`). Clicks inside the cross-origin Spotify iframe never reach the page, so the player won't close itself while in use.
- **`data/releases.js`** — array of releases (`id`, `title`, `year`, `type`, `cover`, `coverAlt`, `embed:{provider,url}`). The real lost,there catalog with self-hosted covers in `public/covers/`. To change: edit a field, swap a `cover` path, or drop a different share URL into `embed.url`. (`featuredRelease` export retained for a possible future featured block; currently unused.)

## Accessibility baseline

- Semantic landmarks (`<nav>`, `<main>`, `<footer>`).
- Single `<h1>` per page, then `<h2>`/`<h3>` hierarchy within.
- Skip-to-content link visible on focus.
- `focus-visible` rings on all interactive elements (links, buttons, form inputs).
- Mobile drawer button uses `aria-expanded` + `aria-controls`; menu auto-closes on route change.
- Form inputs have explicit `<label htmlFor>` associations and `autoComplete` hints.
- Placeholder anchors are rendered as `<button disabled>` so they don't navigate anywhere unexpected.

## Page status

- **Home** — the 3D map overview (renders `null`; the map + pins live in `Layout`/`Atlas`). Navigate by clicking pins.
- **Music** — built, but styled for a solid background — it now renders **over the topo backdrop** through the scrim, so it likely wants restyling for the overlay context. Releases grid of `<ReleaseCard>` fed by the real catalog; cards cross-dissolve into Spotify players (one at a time).
- **Shows / Lab / About / Contact** — still low-fi wireframe, now sitting over the backdrop. Need building/restyling for the overlay.

## Next steps

- **Restyle section pages for the overlay context.** Music/Shows/Lab/About/Contact now render over the live topo backdrop + scrim — they were built for a solid bg. Decide how content sits over the map (panels, scrim strength, spacing) and restyle.
- **Smooth section-to-section camera moves.** Jumping between sections via `SectionMenu` works; tune the easing of the camera hand-off between two section coordinates.
- **Tune the section camera framing** — where the camera lands per section (`CameraRig`'s section branch in `Atlas.jsx`) and how much topography sits behind the content.
- **Real copy + per-route meta** — replace `[PLACEHOLDER]` tokens; tune `useDocumentTitle(...)` descriptions.
- **Visual identity** — swap typeface (`--font-sans` + `<link>`) / accent (`--color-accent`) when locked.
- **Form backend** (Contact) — Formspree / Vercel function / the Flask app in `../server`.
- **Perf** — the three.js bundle is ~280 KB gzip; consider lazy-loading `Atlas` so the splash/other entry doesn't pay for it. Vite warns on chunk size (cosmetic).
- **Go live:** merge `feat/topo-nav` → `main`, then the launch checklist: `VITE_COMING_SOON="false"` on Vercel, remove the `noindex` meta in `index.html`, confirm Namecheap A-records resolve `lostthere.online`.

## Done (this build)

Deploy pipeline (Vercel, GitHub auto-deploy, `client` root, SPA rewrite) · coming-soon gate + `?preview` bypass · design tokens + Inter · `<Embed>` + `<ReleaseCard>` + real Spotify catalog/covers · per-route title+meta · **3D topographic-map homepage** (contour shader + traveling waves), **persistent backdrop in Layout**, route-driven fly-in camera, section pins + slide-in `SectionMenu`, mobile/portrait-aware framing, dense landscape contours. (Bloom was tried and removed.)

---

**Resume prompt for fresh Claude sessions:**

> Working on the lost,there artist site. Vite client at `~/code/projects/artists/lost-there-website/client/` on WSL Ubuntu-20.04. Stack: Vite 5 + React 18 (JSX) + React Router v6 + Tailwind v4 (CSS-first tokens in `src/index.css` `@theme`) + **three 0.160 / @react-three/fiber 8 / @react-three/drei 9** (React-18 majors — don't bump to fiber 9/drei 10). **Active branch: `feat/topo-nav`** (NOT merged to main; `main` is the older flat-page version still deployed behind the splash). The homepage is a **3D holographic topographic map** that is a **persistent backdrop** behind every route: `src/components/scene/` (`Atlas` = the Canvas, mounted once in `Layout`; `Terrain` = contour-shader heightfield with traveling-wave animation; `Markers` = section pins; `sections.js` = coordinates; `terrainHeight.js` = shared fbm). Camera is route-driven (overview mouse-parallax on home with pins; flies to a coordinate and holds for a section, content fading in over a scrim). No nav bar — pins navigate, `SectionMenu` (corner slide-in drawer) jumps around on section pages; persistent `lost,there` title (top-left) + footer. Portrait has its own marker layout + framing. Music/Shows/Lab/About/Contact section pages now overlay the backdrop and likely need restyling. Deployed on Vercel (project `lost-there-website`, team `lostsoundlabs-projects`), gated behind a coming-soon splash (`VITE_COMING_SOON`, `?preview=1`), domain `lostthere.online` attached. Read `client/README.md` (esp. "The 3D map") for full detail.
