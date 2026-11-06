# Launch checklist

## Finishing pass

- **Homepage "Guides" row** linking 3 articles, styled for the dark night section.
- **Speed** (Lighthouse, simulated mobile, local build):
  - Homepage Performance 92 → 97, first contentful paint 2.5 s → 1.4 s, LCP 2.9 s → 2.6 s.
  - Feature page 98; guide 100.
  - What changed: the Alexandria font is now self-hosted (no Google Fonts request), the font and the hero photo are preloaded, and images use WebP (icon 149 KB → 3 KB, logo 20 KB → 2 KB, memory-4 173 KB → 74 KB, hero photo 71 KB → 51 KB).
  - Production should be faster still, because Cloudflare compresses text files, which the local server doesn't.
- **Accessibility and SEO:** Lighthouse scores 100 on the homepage, couples-widgets, games, about, guides hub and a guide. Fixed: store buttons' accessible names, and low-contrast labels.
- **Structured data:** checked in the Schema.org validator with 0 errors and 0 warnings for Organization, WebSite, MobileApplication, WebPage, AboutPage, CollectionPage, BlogPosting and BreadcrumbList. Google's Rich Results Test still needs the live URL after deploy. The app markup won't get a rich result, because Google requires ratings for that and we deliberately don't include store ratings.
- **Comparison drafts:** checked on desktop and phone. Fixed the byline date. On phones the tables scroll sideways inside their box.
- **Outreach:** `docs/seo/outreach.md` has the target list, a pitch template, listing tasks and video ideas.

## Weeks 2–3: content (same branch)

### Published pages (17 URLs in the sitemap)
- Features: `/features/couples-widgets/`, `/features/drawing-widget/`, `/features/couples-games/`, `/features/long-distance/`, `/features/daily-questions/`
- Company: `/about/`, `/press/`
- Guides: `/blog/` plus `/blog/how-to-add-a-couples-widget-on-iphone-and-android/`, `/blog/drawing-ideas-for-couples/`, `/blog/long-distance-date-ideas/`, `/blog/games-to-play-with-your-partner-on-your-phone/`

### Drafts (not built, not in the sitemap)
- `/compare/widgetable-alternative/`, `/compare/locket-for-couples/`. Preview them with `DRAFTS=1 npm run serve`; drafts are `noindex`. Blockers: owner review, plus the Android checks in `product-claims.md`. Create a `/compare/` hub once both are live.

### Site-wide changes
- New nav on the homepage and legacy pages: Widgets, Games, Long distance, Guides, Support (it replaces the `/#features`, `/#how` and `/#faq` anchor links).
- New footer columns on every page: Product (5 feature pages + Download), Company (About, Guides, Press kit, Support, Feedback), Legal.
- Homepage chapters link to the Daily questions, Drawing widget and Games pages; the widgets section links to the Couples widgets page.

### Checks (`npm run ci`)
- Unique titles and descriptions, one H1, a canonical that matches the sitemap URL, valid JSON-LD with no `aggregateRating`.
- Every internal link resolves; every sitemap page is linked from another page; `related:` links that point to missing or draft pages fail the build.
- Browser check of 15 pages at 375px: no horizontal scroll, no broken images, one H1 each.

### Owner tasks for content
1. Read every page for accuracy. Items marked ⚠️ in `product-claims.md` especially need confirming.
2. Approve the byline "The Lovio team".
3. Provide real app screenshots. The visuals are currently illustrations built from the homepage's widget art, captioned as such.
4. Approve or edit the comparison drafts, then remove `draft: true`.

## Week 1: technical foundation (branch `seo/week-1-foundation`)

### Done in the repo
| Item | Where | Verified |
|---|---|---|
| Eleventy build into `_site/`; original pages copied byte-for-byte | `eleventy.config.js`, `src/` | `npm run ci` checks every passthrough file is identical |
| `robots.txt` with `Sitemap:` line | `robots.txt` | `npm run ci` |
| `sitemap.xml` (5 indexable pages; `/download/` and `/invite/` are noindex, so excluded) | `src/sitemap.njk`, `src/_data/site.js` | `npm run ci` checks each URL exists, isn't noindex, and has a matching canonical |
| Homepage title → "Lovio — Couples App with Widgets, Daily Questions & Games"; new meta and OG description | `index.html` | Browser preview |
| Line above the H1: "Couples app · iPhone & Android" (one line at 375px) | `index.html` | Desktop and mobile preview |
| FAQ entry "What is Lovio?" carrying the entity sentence | `index.html` | Browser preview |
| JSON-LD: Organization (FOURPLEX SIA, brand Lovio), WebSite, MobileApplication (free offer, both store URLs, **no aggregateRating**) | `index.html` | `npm run ci` parses JSON-LD and rejects aggregateRating. **Still to do:** run the live URL through https://search.google.com/test/rich-results after deploy |
| Store links: `rel="noopener"` (was `noopener noreferrer`) so the Worker can see which page a click came from; homepage buttons tagged `?placement=hero` / `?placement=footer-cta` | `index.html`, `download/`, `invite/` | `placement` is not forwarded to the stores |
| Worker logs each `/go/*` click to Analytics Engine (platform, source page, placement, utm_*, country; no IP or user agent) | `cloudflare-worker/` | Local test: redirect `Location` headers identical before and after; logging failures can't break the redirect |
| GitHub Actions: build, check, deploy to Pages on push to `main`; build and check only on PRs | `.github/workflows/deploy.yml` | Runs on the first PR |

### Owner tasks (in this order)
1. **Switch GitHub Pages to Actions deploys** *before or at* merge: Repo → Settings → Pages → Source: **GitHub Actions**. Until then, `main` keeps serving the repo root (the old setup still works, but without `sitemap.xml`).
   After the switch, confirm `/privacy`, `/terms`, `/invite/ABC123` (404 → invite redirect), `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` still respond as before.
2. **Deploy the Worker:** `cd cloudflare-worker && npx wrangler deploy`. The Analytics Engine dataset is created automatically on first write.
   Query example (Cloudflare API → Analytics Engine SQL):
   `SELECT blob1 AS platform, blob2 AS page, blob3 AS placement, SUM(_sample_interval) AS clicks FROM lovio_store_clicks WHERE timestamp > NOW() - INTERVAL '7' DAY GROUP BY platform, page, placement ORDER BY clicks DESC`
3. **Cloudflare dashboard:**
   - SSL/TLS → Edge Certificates → **Always Use HTTPS: On**. Today `http://getlovio.app/` returns 200 instead of redirecting.
   - Security → Bots / AI Crawl Control: make sure `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Googlebot` and `Bingbot` aren't blocked or challenged. Decide on training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`).
   - Managed robots.txt: either turn it off or confirm the live file still ends with our `Sitemap:` line.
   - Analytics → **Web Analytics**: enable it for getlovio.app with automatic setup (cookieless, no code change). Check the privacy-policy wording.
4. **Search Console:** submit `https://getlovio.app/sitemap.xml`; run URL Inspection on `/`.
5. **Bing Webmaster Tools:** import the site from Search Console, submit the sitemap, and turn on IndexNow (Cloudflare → Caching → Configuration → Crawler Hints).
6. **Rich Results Test** on `https://getlovio.app/` after deploy.

### Known, left as is
- `404.html` redirects unknown URLs to `/` with JavaScript. The HTTP status is still 404, so this is acceptable; revisit if Search Console reports soft 404s.
- Canonicals for legal and support pages use `.html` URLs; both `/privacy` and `/privacy.html` return 200. They're consistent, so no change.
- iOS campaign attribution: the Worker passes UTMs as `referrer=` to the App Store. App Store Connect's Sources report uses `pt` (provider token) and `ct` (campaign). Add those once the provider token is known.
