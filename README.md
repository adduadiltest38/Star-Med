# Star Med Clinic — Website

Official website for **Star Med Clinic / Star Med Polyclinic**, Opposite Hanafi Masjid, Mouvval, Pallikkara 671316.
_“Committed to your health, Always”_

Built with **Astro 7**, **React 19** islands, **TypeScript (strictest)**, **Tailwind CSS 4**, **GSAP 3 + ScrollTrigger**, **Lenis** and **Lucide** icons. Fully static output — deploy anywhere.

---

## Quick start

```bash
# Node.js >= 22.23.4
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check (astro check) + production build → dist/
npm run preview      # serve the production build locally
```

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production URL (no trailing slash). Used for canonical URLs, Open Graph, sitemap, robots.txt and JSON-LD. **Required before launch.** |
| `PUBLIC_FORM_ENDPOINT` | Optional JSON endpoint for the enquiry form (Formspree, Web3Forms, Getform, or your own function). |

---

## ⚠️ Before going live — information the clinic must confirm

The site never invents clinic facts. Anything unconfirmed is shown as a clearly marked “to be confirmed / to be updated by the clinic” state. Update these files:

| What | Where |
| --- | --- |
| Phone, WhatsApp, email | `src/config/site.ts` → `contact` |
| Opening hours | `src/config/site.ts` → `openingHours` |
| Exact Google Maps pin / embed | `src/config/site.ts` → `maps.placeUrl`, `maps.embedSrc` |
| GPS coordinates (for local SEO) | `src/config/site.ts` → `geo` |
| Social media profiles | `src/config/site.ts` → `social` |
| Services, availability notes, show/hide | `src/data/services.ts` (`enabled`, `availabilityNote`) |
| Hospitalization (hidden until confirmed) | `src/data/services.ts` → set `enabled: true` |
| Laboratory test list (example placeholder) | `src/data/laboratory.ts` → edit tests, then `confirmed: true` |
| Doctors (intentionally empty) | `src/data/doctors.ts` — add only verified doctors |
| Specialities | `src/data/specialities.ts` |
| Official logo | `src/components/ui/Logo.astro` (currently a recreated vector mark) |
| Photographs (currently Unsplash stock) | `src/assets/images/` (see **Images** below) |

As soon as a phone / WhatsApp number is added, click-to-call buttons, WhatsApp buttons, the mobile quick-action bar and the form hand-off appear automatically across the site.

---

## Project structure

```
├── astro.config.mjs          # Integrations, fonts (self-hosted), sitemap, SITE_URL
├── design/illustrations/     # SVG sources for the default illustrations
├── public/                   # favicon, icons, web manifest (static, unprocessed)
├── scripts/
│   ├── render-illustrations.mjs   # SVG → PNG masters (Playwright)
│   └── render-icons.mjs           # favicon.ico, apple-touch-icon, PWA icons, logo.png
└── src/
    ├── assets/images/        # Image masters → optimised to AVIF/WebP at build
    ├── components/
    │   ├── layout/           # Header (sticky + accessible mobile menu), Footer, MobileActionBar
    │   ├── sections/home/    # Homepage sections (Hero, Services, Specialities, …)
    │   ├── seo/              # SEO meta tags, JSON-LD renderer
    │   └── ui/               # Design-system primitives (Button, Logo, Icon, cards, Notice…)
    ├── config/site.ts        # ★ Clinic details, contact, maps, hours, nav, social
    ├── data/                 # ★ Services, specialities, doctors, lab tests, “why choose”
    ├── islands/              # React islands: EnquiryForm, LabTestFinder
    ├── layouts/              # BaseLayout (head/SEO/scripts), PageLayout (inner-page hero + breadcrumbs)
    ├── lib/
    │   ├── animations.ts     # GSAP/ScrollTrigger/Lenis motion system
    │   ├── contact.ts        # tel:/WhatsApp/maps link builders
    │   └── seo.ts            # schema.org builders, title + path helpers
    ├── pages/                # Routes (file-based)
    └── styles/global.css     # Tailwind v4 theme tokens + design system
```

### Routes

`/` · `/about` · `/services` · `/services/{general-consultation,specialist-consultation,ecg,casualty,observation,medical-procedures,home-care}` · `/specialities` · `/doctors` · `/laboratory` · `/pharmacy` · `/contact` · `/404` · `/robots.txt` · `/sitemap-index.xml`

Service detail pages are generated from `src/data/services.ts`; Laboratory and Pharmacy have dedicated pages.

---

## Design system

Tokens live in `src/styles/global.css` (`@theme`):

- **Brand blue** `brand-50…950` (primary `#1659C4`) — trust, professionalism
- **Teal** `teal-50…900` — medical technology
- **Green** `green-50…900` — wellness (also the star in the logo)
- **Ink** `#0B1B36` text · **Surface** `#F4F8FC` backgrounds
- Typography: **Plus Jakarta Sans** (display) + **Inter** (body), self-hosted via Astro’s Fonts API with metric-matched fallbacks (no layout shift)
- Components: `.card`, `.glass`, `.eyebrow`, `.h-display`, `.h-section`, `.lead`, `.text-gradient`, `.container-x`, `.section`

---

## Motion

`src/lib/animations.ts` is **lazy-loaded only when the visitor allows motion** — reduced-motion users download no animation code, and all content is visible without JavaScript. A 2.5 s failsafe reveals everything if scripts fail.

Add behaviour declaratively in markup:

| Attribute | Effect |
| --- | --- |
| `data-hero="n"` | Hero entrance timeline (ordered) · `data-hero-split` / `data-hero-image` variants |
| `data-reveal` | Fade + rise on scroll |
| `data-stagger` | Children reveal in sequence |
| `data-split` | Word-by-word heading reveal (screen-reader safe) |
| `data-img-reveal` | Clip-path image reveal |
| `data-float` | Gentle floating decoration |
| `data-draw` | SVG line draw |
| `data-parallax` | Very subtle parallax (capped) |
| `data-magnetic` | Pointer-follow buttons (fine pointers only) |

Lenis smooth scrolling runs on desktop pointers only (native scrolling on touch), pauses when the mobile menu is open, and is disabled entirely for reduced motion. Page-to-page transitions use the native CSS View Transitions API (zero JS).

---

## Enquiry form

`src/islands/EnquiryForm.tsx` — appointment / general enquiry with validation, error summary, honeypot and accessible states. Fields: patient name, phone, requested service, preferred date, message. No medical records are collected.

Delivery is chosen automatically:

1. `PUBLIC_FORM_ENDPOINT` set → JSON `POST` to that endpoint.
2. else WhatsApp configured → opens WhatsApp with the enquiry pre-filled.
3. else email configured → opens the visitor’s email app.
4. else → shows a friendly “online enquiries not active yet” message.

The success state always states that an appointment request is **not** a confirmed booking.

Deep links: `/contact?service=ecg#enquiry` pre-selects a service, `?type=general` opens the general tab.

---

## SEO

- Unique titles/descriptions, canonical URLs, Open Graph + Twitter cards (1200×630 JPG generated at build)
- JSON-LD: `MedicalClinic` (LocalBusiness) with address, areas served, specialties and service catalogue; `WebSite`; per-page `WebPage`/`AboutPage`/`ContactPage`/`MedicalWebPage`; `BreadcrumbList`; `Service`; `Physician` (once doctors are added). Phone, hours, geo and `sameAs` are emitted automatically once configured.
- `sitemap-index.xml` (via `@astrojs/sitemap`) and `robots.txt` (generated from `SITE_URL`)
- Semantic HTML, single H1 per page, breadcrumbs on inner pages, descriptive alt text, internal linking
- Local-SEO copy for Pallikkara and nearby areas (`site.areaServed`)

Validate after deploying: Google Rich Results Test and Search Console (submit the sitemap).

---

## Images

All images go through `astro:assets` → responsive **AVIF + WebP** with explicit dimensions (no CLS); below-the-fold images lazy-load; the hero image is eager with `fetchpriority="high"`.

The current photos are **temporary open-licensed stock images from Unsplash** (Unsplash License — free for commercial use). Sources are listed in `src/assets/images/CREDITS.md`. People shown are models, not Star Med staff or patients.

To use the clinic's own photographs, replace the files in `src/assets/images/` **keeping the same filenames** (`hero-doctor.jpg` portrait 4:5; others landscape, ≥ 1600 px wide), then update the alt text in the relevant component/data file. Nothing else needs to change.

Alternative illustrated artwork is kept in `design/illustrations/` (SVG). To edit and re-render it:

```bash
node scripts/render-illustrations.mjs          # needs Playwright (npm i -D playwright && npx playwright install chromium)
node scripts/render-icons.mjs                  # regenerate favicons/logo from public/favicon.svg
```

---

## Deployment

The build outputs static files to `dist/` (`build.format: 'file'` → `/about.html` served at `/about`).

- **Netlify:** build `npm run build`, publish `dist`. Set `SITE_URL`.
- **Vercel:** framework preset *Astro*, output `dist`. Set `SITE_URL`.
- **Cloudflare Pages:** build `npm run build`, output `dist`. Set `SITE_URL` and `NODE_VERSION=22`.
- **Any static host / Nginx:** upload `dist/`; add `try_files $uri $uri.html $uri/ =404;` and serve `404.html` for missing pages.

Cache `/_astro/*` as immutable (`Cache-Control: public, max-age=31536000, immutable`) — a `public/_headers` file is included for Netlify/Cloudflare.

---

## Quality checks performed

- `astro check`: 0 errors, 0 warnings
- Every page rendered at 360 px and 1440 px: no horizontal overflow, no console errors
- Lighthouse (mobile emulation, local preview): Performance 98–99 · Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0
- Keyboard: skip link, visible focus rings, focus-trapped mobile menu (Esc to close), form error summary with links to fields
- Reduced motion & no-JS: all content visible, animation bundle not loaded

## Optional: Remotion

Remotion is not included as a runtime dependency (it is not needed for the site and would add weight). If the clinic wants a promotional video, create a separate Remotion project, export an MP4/WebM, and place it in `public/` with a `<video>` element using `preload="none"` and a poster image.
