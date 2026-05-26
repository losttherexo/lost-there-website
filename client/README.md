# lost,there — Vite client

Rework of the lost,there artist site. Migrated from Create React App to Vite, restructured into a 6-page wireframe with shared Layout. Target deploy: Vercel.

## Stack

- **Vite 5** + **React 18** (JSX)
- **React Router v6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, CSS-first config — no `tailwind.config.js`)
- **Inter** (Google Fonts, placeholder typeface)

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

**Nav** (`components/Layout.jsx`) — desktop bar + mobile hamburger drawer; active route shows an accent underline (desktop) / accent left-rail (mobile) via `NavLink`; drawer closes on route change **and on Escape**; skip-to-content link wired to `#main`.

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
   │  ├─ Layout.jsx        ← persistent <nav>, <main>, <footer>, skip-link, mobile drawer
   │  ├─ Placeholder.jsx   ← labeled wireframe box
   │  ├─ Embed.jsx         ← provider-aware embed wrapper (Spotify/SoundCloud/untitled/yt…)
   │  └─ ReleaseCard.jsx   ← release grid card; expands to player + track listing
   ├─ data/
   │  └─ releases.js       ← editable placeholder release data (drives Music + Home featured)
   ├─ hooks/
   │  └─ useDocumentTitle.js ← per-route <title> + <meta name="description">
   └─ pages/
      ├─ Home.jsx           ← BUILT: minimal wordmark canvas (installation direction)
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

- **Home** — built. Stripped to a bare wordmark canvas (the site is heading toward doubling as a media installation, so Home is deliberately empty of nav-style clutter).
- **Music** — built. `Releases` heading + responsive grid of `<ReleaseCard>` fed by the real catalog; cards cross-dissolve into Spotify players (one at a time). Footer socials are real.
- **Shows / Lab / About / Contact** — still low-fi wireframe (dashed `<Placeholder>` boxes, bracketed copy). Hierarchy reads; visual identity deferred.

## Next steps

- **Strip / build the other four pages.** Shows, Lab, About, Contact are still wireframe — give them the same treatment as Home/Music.
- **Real copy.** Replace remaining `[PLACEHOLDER]` tokens (bio, press, project descriptions, booking copy, tour dates) and tune the per-route meta descriptions in each page's `useDocumentTitle(...)` call.
- **Visual identity.** Still neutral-by-design. Swap the typeface (`--font-sans` + the `<link>`) and accent (`--color-accent`) when locked; both are single-token changes.
- **More embeds.** `<Embed>` already handles SoundCloud / untitled / YouTube / etc. — point the Lab's TD-reel / previz slots at it when ready.
- **Form backend.** Contact form is markup-only (no backend in scope). Options: Formspree / a Vercel function / the Flask app in `../server`.
- **Press-kit downloads.** Wire About's `[DOWNLOAD]` buttons to real files under `public/press/`.
- **Launch checklist:** set `VITE_COMING_SOON="false"` on Vercel, remove the `noindex` meta in `index.html`, and confirm the Namecheap A-records have propagated so `lostthere.online` resolves.

## Done (this build)

Deploy pipeline (Vercel, GitHub auto-deploy, `client` root, SPA rewrite) · pre-launch coming-soon gate + `?preview` bypass · design-system tokens + Inter · real nav · Home + Music built · `<Embed>` + `<ReleaseCard>` · real Spotify catalog + self-hosted covers · real socials · per-route title + meta.

---

**Resume prompt for fresh Claude sessions:**

> Working on the lost,there artist site. Vite client at `~/code/projects/artists/lost-there-website/client/` on WSL Ubuntu-20.04. Stack: Vite 5 + React 18 (JSX) + React Router v6 + Tailwind CSS v4 (CSS-first tokens in `src/index.css` `@theme`). Deployed on Vercel (project `lost-there-website`, team `lostsoundlabs-projects`) via GitHub auto-deploy on `main`; **live but gated behind a coming-soon splash** (`VITE_COMING_SOON` env, `?preview=1` bypass), custom domain `lostthere.online` attached (Namecheap A-records). Home is a bare wordmark canvas; Music has the real Spotify catalog as cards that cross-dissolve into players (one-at-a-time state in `Music.jsx`); Shows/Lab/About/Contact are still wireframe. Shared `<Layout>` (nav + footer + skip-link + mobile drawer), `<Embed>` (provider-aware), `<ReleaseCard>` (controlled). Read `client/README.md` for full detail.
