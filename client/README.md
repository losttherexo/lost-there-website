# lost,there — Vite client

Rework of the lost,there artist site. Migrated from Create React App to Vite, restructured into a 6-page wireframe with shared Layout. Target deploy: Vercel.

## Stack

- **Vite 5** + **React 18** (JSX)
- **React Router v6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, CSS-first config — no `tailwind.config.js`)

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

**DNS — Namecheap → Vercel.** In Namecheap: *Domain List → Manage → Advanced DNS*. Remove any default parking/`URL Redirect` records, then add:

| Type    | Host  | Value                   | TTL       |
|---------|-------|-------------------------|-----------|
| `A`     | `@`   | `76.76.21.21`           | Automatic |
| `CNAME` | `www` | `cname.vercel-dns.com.` | Automatic |

Then in Vercel *Project → Settings → Domains* add both `lostthere.online` and `www.lostthere.online` (set one as primary; Vercel issues the TLS cert automatically once DNS resolves). Verify propagation with `dig lostthere.online +short` (expect `76.76.21.21`) and `dig www.lostthere.online +short` (expect the Vercel CNAME), or https://dnschecker.org. Propagation is usually minutes, up to ~a few hours.

**Search indexing:** `index.html` carries `<meta name="robots" content="noindex,nofollow">` so the placeholder wireframe doesn't get indexed. **Remove that line when real content ships.** (Chose this over a "coming soon" gate — one line to delete vs. a toggle component to maintain, and nobody's finding the domain organically yet.)

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
   ├─ components/
   │  ├─ Layout.jsx        ← persistent <nav>, <main>, <footer>, skip-link, mobile drawer
   │  └─ Placeholder.jsx   ← labeled wireframe box
   ├─ hooks/
   │  └─ useDocumentTitle.js
   └─ pages/
      ├─ Home.jsx
      ├─ Music.jsx
      ├─ Shows.jsx
      ├─ Lab.jsx
      ├─ About.jsx          ← dual-purpose: fan bio + press kit
      ├─ Contact.jsx
      └─ NotFound.jsx
```

## Accessibility baseline

- Semantic landmarks (`<nav>`, `<main>`, `<footer>`).
- Single `<h1>` per page, then `<h2>`/`<h3>` hierarchy within.
- Skip-to-content link visible on focus.
- `focus-visible` rings on all interactive elements (links, buttons, form inputs).
- Mobile drawer button uses `aria-expanded` + `aria-controls`; menu auto-closes on route change.
- Form inputs have explicit `<label htmlFor>` associations and `autoComplete` hints.
- Placeholder anchors are rendered as `<button disabled>` so they don't navigate anywhere unexpected.

## Wireframe fidelity

Low. Boxes, dashed borders, labeled placeholder text. Dark palette is a base — final visual identity is intentionally deferred. Hierarchy and spacing read clearly; everything else is up for grabs.

## Next steps

- **Real content.** Replace every `[PLACEHOLDER]` token in `src/pages/` — tagline, bio, press quotes, project descriptions, capabilities statement, booking copy, tour dates.
- **Visual identity.** Final type, color, motion language. Likely candidates: type pairing, a tighter neutral palette (natural tones / blues / B&W per artist direction), real photography. Tailwind `@theme {}` in `src/index.css` is where global tokens live.
- **Embeds.** Wire `[SPOTIFY EMBED]`, `[SOUNDCLOUD EMBED]`, `[UNTITLED.STREAM EMBED]`, `[LIVE VIDEO EMBED]`, `[TD REEL EMBED]`, `[UNREAL PREVIZ EMBED]`, `[RELEASE EMBED]`, `[PROJECT THUMBNAIL/VIDEO]` slots with the real embed iframes. Probably abstract into a small `<Embed kind="spotify" id="..." />` component.
- **Form backend.** Contact form is markup-only. Options: Formspree / Netlify Forms / a Vercel Edge Function / your own Flask server (currently sits in `../server`, out of scope for this rework).
- **Press-kit downloads.** Wire the `[DOWNLOAD]` buttons in About to real files (or zip them) under `public/press/`.
- **Social link URLs.** Replace `[INSTAGRAM]` / `[SPOTIFY]` / etc. buttons with real `<a href>`s in `Layout.jsx` and `Contact.jsx`.
- **Deploy to Vercel.** `vite build` produces `dist/`. Vercel auto-detects Vite; just connect the repo and set `client` as the root.
- **(Stretch) Light-mode toggle.** Wireframe is dark-only. Tailwind v4 supports `@variant dark` for adding a system-toggleable palette later.

---

**Resume prompt for fresh Claude sessions:**

> I'm reworking my artist site for lost,there. The Vite client lives at `~/code/projects/artists/lost-there-website/client/` on WSL Ubuntu-20.04. Stack: Vite 5 + React 18 (JSX) + React Router v6 + Tailwind CSS v4. The site is a 6-page wireframe (Home, Music, Shows, Lab, About/EPK, Contact) with a shared `<Layout>` (nav, main, footer, skip-link, mobile drawer) and a `<Placeholder>` component for labeled wireframe boxes. Dark palette baseline (`bg-neutral-950` / `text-neutral-100`). Pages live in `src/pages/`, shared bits in `src/components/` and `src/hooks/`. Backend Flask app sits in `../server` but is out of scope. Branch: `vite-migration`. Read `client/README.md` for the migration summary and next-steps list.
