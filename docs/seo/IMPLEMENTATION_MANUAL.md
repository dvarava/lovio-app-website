# Lovio: SEO + GEO Implementation Manual (v2)

**Site:** https://getlovio.app · **Company:** FOURPLEX SIA · **Revised:** 6 November 2026
**Replaces:** `Lovio_SEO_GEO_Claude_Code_Implementation_Manual.md` (v1)

> **For Claude Code:** This is the implementation brief. Build what it says; don't stop at an audit. Where a product or competitor claim can't be verified, ship the page as a draft (excluded from the sitemap, navigation and indexing) and list the blocker. Never invent facts, reviews, numbers or people.

---

## 0. What changed from v1, and why

| v1 | v2 | Reason |
|---|---|---|
| Assumed a minimal one-screen homepage | Starts from the real site (rich homepage, FAQ, already in Search Console) | v1's baseline was out of date |
| Assumed a framework with components and content collections | Plain static HTML on GitHub Pages + Cloudflare; add **Eleventy** as a thin build step | Shared headers, sitemap and metadata can't be maintained by hand across 20+ pages |
| 29 pages, starting with broad relationship articles | **~13 pages in phase 1, led by widgets** | Broad topics ("100 questions for couples") are owned by Paired, magazines and dozens of vendor listicles; a new domain won't rank there for a long time |
| Competitors: Paired and Pookie | **Widgetable and Locket first**; Paired later; Pookie deprioritised | Lovio competes directly on widgets; "Pookie" refers to several unrelated apps |
| Off-site mentions pushed to P2 | **Off-site presence is a phase-1 pillar** | AI engines mostly cite third parties (Wikipedia, Reddit, YouTube, review sites, roundups), not a brand's own pages |
| 7 process documents | 2: `product-claims.md`, `launch-checklist.md` | A small team won't maintain seven |
| No Bing | Bing Webmaster Tools + IndexNow | ChatGPT Search relies partly on Bing's index |
| Generic click tracking | Count store clicks inside the existing `/go/*` Worker; cookieless page analytics | The site has no analytics today; this adds no client-side tracking |

---

## 1. Goal and reality check

**Goal:** more qualified store visits from Google, Bing and AI assistants. The order is (1) be found for searches where Lovio is genuinely the answer (widgets, drawing, long distance, games for two), then (2) become an entity AI assistants know and describe accurately, then (3) widen into editorial topics.

**Reality check:**
- No ranking, AI citation or install outcome can be guaranteed.
- Google says AI Overviews and AI Mode run on its core ranking systems, so GEO for Google *is* SEO. `llms.txt` is ignored by Google; special schema isn't needed; mass-produced pages can breach its scaled-content-abuse policy ([Google AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).
- AI engines disagree with each other a lot. Industry studies report low source overlap between ChatGPT, Perplexity and Google AI Overviews, with Wikipedia, Reddit and YouTube cited heavily. These are vendor studies, so treat the numbers as directional. The practical takeaway still holds: **being mentioned on other sites matters as much as your own pages.**
- Expected timeline: technical fixes and feature pages can show in Search Console within 2–6 weeks. Editorial pages typically take 3–6+ months and depend on links.

---

## 2. Verified baseline (checked 6 Nov 2026)

### Website
| Item | State | Action |
|---|---|---|
| Hosting | GitHub Pages (`CNAME`, `.nojekyll`) behind Cloudflare; the `cloudflare-worker/` Worker handles only `getlovio.app/go/*` | Keep |
| Pages | `/`, `/download/`, `/invite/`, `/support.html`, `/feedback.html`, `/privacy`, `/terms`, `404.html` | Preserve every URL |
| `/.well-known/apple-app-site-association`, `assetlinks.json` | Present, needed for universal and app links | **Must survive any build step unchanged** |
| Homepage | Strong design, real FAQ, store buttons, mockups built in HTML | Keep; improve title, entity text and links |
| `<title>` | "Lovio — Made for the two of you" (says nothing about the category) | Change (see §6) |
| H1 | "Made for the two of you." | Keep as the brand line; add a descriptive eyebrow or subhead containing "couples app" |
| Search Console | Verified (meta tag in `index.html`) | Submit the sitemap after launch |
| `robots.txt` | Cloudflare-managed file with content-signal comments only, no rules, **no `Sitemap:` line** | Replace with our own file (§7) |
| `sitemap.xml` | **404** | Generate it |
| JSON-LD | **None on any page** | Add (§7) |
| Analytics | None on the marketing site | Add cookieless analytics and count clicks in the Worker (§9) |
| CSS/JS cache-busting | `?v=YYYYMMDD` query strings | Have the build step automate this |
| Bot access | Default user agent, `OAI-SearchBot`, `PerplexityBot` and `GPTBot` all get 200 | Keep; re-check after any Cloudflare "AI Crawl Control" change |

### Product facts (App Store lookup API, US, 6 Nov 2026)
- Name: **Lovio – Couples App & Widgets**; seller **FOURPLEX SIA**; App Store ID 6743631737; Android package `com.fourplex.lovio`; iOS 16+; Lifestyle / Social Networking.
- Rating **4.6 from 370 ratings** (US store; changes over time; show only as text with a date and a link, **never as schema**, see §7).
- Free to download, with Lovio Premium. The homepage already states **"one subscription covers both of you"**, so the team treats it as confirmed. Keep `product-claims.md` evidence for it.
- Features (store description + 30 Oct 2026 release): pairing; Days Together, Drawing and Memory widgets; sticky notes; collaborative date-idea swiping with a long-distance option; shared bucket list; couples quizzes; memory scrapbook; Daily Spark questions; **Us Streak**; **The Arcade** with 8 two-player games (Pairfall, Block Bloom, 2048, Charades, Sling Puck, Four in a Row, Crushwords, Find the Match), playable live or turn-based.

### Claim conflicts to resolve before publishing (owner)
1. The store says the drawing widget lets you "doodle on your partner's screen in **real-time**", and the homepage says a note "lands on their widget **the moment you send it**". OS widget refresh limits apply, especially on iOS. **Decide one accurate phrasing** and use it everywhere, store listing included.
2. Which features are Premium versus free on each platform. The homepage names quizzes and Arcade games as Premium; confirm the rest.
3. Widget parity between iOS and Android (lock-screen widgets are iOS-only as a concept; confirm what Android supports).
4. Prices: don't print them on the site. Link to the stores instead.

---

## 3. Competitive landscape (what the research showed)

- **The drawing-widget niche is crowded:** Widgetable, Locket (photos), Paint Love, Couple Widget +, Noteit, drawn, duolove, Loveya, Couple Widgets: Keep Memories, LovePet, Lovebox Widget. Several also sell one subscription for both partners, so **"one subscription for two" is not unique**; present it as a convenience, not a differentiator.
- **What Lovio has that most widget apps don't:** widgets *plus* a full couples app (Daily Spark, dates, quizzes, scrapbook) *plus* 8 two-player games. Position on this bundle: **"the couples app where widgets are only the start."**
- **"Best couples apps" results are flooded** with listicles written by app makers, many on throwaway `*.pages.dev` domains. Another self-published "best apps" page won't stand out. Getting included in the *third-party* roundups that rank (marriage.com, The Knot, iOSHacker, WhistleOut and similar) is worth more.
- **Name confusion:** searches for "Lovio" also surface LovOn, Lovora, LovieQuest, Lovoo and a `lovio.co.uk` Trustpilot page. That makes a clean, consistent entity description (§8) a priority.

---

## 4. Strategy: three pillars, run in parallel

1. **Technical foundation:** crawlable, structured, measurable. Days of work.
2. **Owned content, widget-led:** about 13 high-quality pages where Lovio is a truthful answer.
3. **Off-site presence:** listings, roundups, short videos, honest community participation, and a consistent entity description everywhere.

---

## 5. Build approach (for Claude Code)

- Add **Eleventy (11ty)** with Nunjucks or plain HTML templates and Markdown for articles. Output is static HTML, exactly what GitHub Pages already serves.
- Deploy through a **GitHub Actions → GitHub Pages** workflow that builds `_site/`. Confirm the owner can switch the Pages source to "GitHub Actions" before relying on it. Fallback: commit the built output.
- **Passthrough copy, unchanged:** `assets/`, `.well-known/`, `CNAME`, `favicon.ico`, `.nojekyll`, `styles.css`, `home.css`, `site.js`, and the existing pages. First migrate the existing pages into a shared layout **without visual changes**, and diff the rendered HTML before and after.
- **URLs:** keep `/privacy`, `/terms`, `/support.html`, `/feedback.html`, `/download/` and `/invite/` working exactly. New pages use trailing-slash directories (`/features/drawing-widget/`). Canonicals match that form.
- **Don't touch** `cloudflare-worker/` routing logic except for the click logging in §9.
- Shared pieces: header and footer (add Features, Blog and About links), store CTA block (always `/go/ios` and `/go/android`), breadcrumb, FAQ block, related-links block, article byline and dates, a JSON-LD helper (escape `</`), and a meta helper that fails the build on a missing or duplicate title or description.
- Front matter: `title, description, h1, slug, type (feature|article|hub), primaryQuery, related[], publishedAt, updatedAt, draft, sources[]`. With `draft: true` the page is excluded from collections, the sitemap and navigation, and gets `noindex`.
- Images: real app screenshots (from the owner) as WebP with width and height set; lazy-load everything except the LCP image.

---

## 6. Phase-1 page set (~13 pages)

### Homepage changes (no redesign)
- `<title>`: **`Lovio – Couples App with Widgets, Daily Questions & Games`**
- Meta description: `Send drawings to your partner's widget, answer a daily question together, plan dates and play 8 two-player games. Free on iPhone and Android.` (adjust once the "real-time" wording is settled)
- Add a one-sentence entity line near the top, visible: *"Lovio is a couples app for iPhone and Android by FOURPLEX SIA: shared widgets, daily questions, date ideas, memories and two-player games, synced between partners."* Reuse **the exact same sentence** on About, in the stores' first line, and on listings (§8).
- Turn the "A day with Lovio" chapters and the widget section into links to the new feature pages. Add a "Guides" row linking 3 articles.
- Point nav anchors (`/#widgets`, …) to the real pages once they exist.

### Feature pages (P0)
| URL | Main query family | Must include |
|---|---|---|
| `/features/couples-widgets/` | couples widgets, widgets for couples, iPhone couples widget | Each widget, what it shows, iOS/Android support, Premium status, **step-by-step add-widget instructions per OS** with screenshots |
| `/features/drawing-widget/` | drawing widget for couples, send drawings to partner's home screen | How it works, accurate update-timing wording, drawing tips, limits; link to the drawing-ideas article |
| `/features/couples-games/` | games for couples on phone, two-player games app | All 8 Arcade games with a sentence each, live vs turn-based play, Us Streak, Premium status |
| `/features/long-distance/` | long-distance relationship app | Widgets, date-idea LDR filter, Daily Spark across time zones, games; honest "what it won't replace" note |
| `/features/daily-questions/` | daily questions app for couples | How Daily Spark works (both answer, then reveal), 10 sample questions (original), quizzes |

P1 (phase 2): `/features/date-ideas/`, `/features/shared-memories/`.

### Hubs and trust
- `/about/`: what Lovio is, who makes it (FOURPLEX SIA, Riga, Latvia, if the owner confirms the city), contact, store links, press-kit link. No invented founding story.
- `/blog/`: hub, grouped by topic. Created when the first article ships.
- `/press/` (simple): logo, app icon, 4–6 approved screenshots, the entity sentence, contact. This makes coverage by writers and roundups easy.

### Articles (P0: each one supports a feature page)
| URL | Why this one | Links to |
|---|---|---|
| `/blog/how-to-add-a-couples-widget-on-iphone-and-android/` | How-to search where we hold first-hand knowledge; good snippet and AI-answer candidate | couples-widgets |
| `/blog/drawing-ideas-for-couples/` | Supports the drawing widget; original prompts by mood, with example doodles we draw ourselves | drawing-widget |
| `/blog/long-distance-date-ideas/` | Proven demand; group ideas by time zone gap, budget and effort | long-distance |
| `/blog/games-to-play-with-your-partner-on-your-phone/` | Supports the Arcade; can honestly mention non-Lovio options too | couples-games |

### Comparisons — dropped
The owner decided against Lovio-vs-competitor pages (2026-11-06): they are self-published, so they carry little weight with AI assistants, and they create claim risk. "Alternative to X" visibility comes from independent roundups and AlternativeTo instead (`docs/seo/outreach.md`).

Phase 2 candidates (only with demand evidence from Search Console): cute notes for your partner, at-home date ideas, couples bucket list ideas, conversation starters.

---

## 7. Technical SEO checklist

- **robots.txt** (committed to the repo; switch off Cloudflare's managed robots.txt, or confirm it appends ours):
  ```
  User-agent: *
  Allow: /
  Sitemap: https://getlovio.app/sitemap.xml
  ```
  Training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`) are a **business decision**; allowing them can help models learn about Lovio over the long run. Never block `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Googlebot` or `Bingbot`. In the Cloudflare dashboard, check that **AI Crawl Control / Bot Fight Mode** isn't challenging these bots.
- **sitemap.xml** generated from non-draft pages; `lastmod` only from a real `updatedAt`.
- **Canonical, OG and Twitter tags** on every page; build fails on duplicates. A per-page OG image is optional (fall back to `og-image.png`).
- **JSON-LD** (only what's visible on the page):
  - Homepage: `Organization` (name, url, logo, `sameAs`: App Store URL, Google Play URL, real social profiles) + `WebSite` + `MobileApplication` (name, `operatingSystem: "iOS, Android"`, `applicationCategory: "LifestyleApplication"`, `offers: {price: 0, priceCurrency: "USD"}`, `publisher` → Organization).
  - **No `aggregateRating` from store ratings.** Google's review-snippet rules don't allow ratings collected on other sites. Showing "4.6★ on the App Store (370 ratings, Nov 2026)" as visible, linked text is fine.
  - Articles: `BlogPosting` with the publisher, real dates and the image. Feature, article and comparison pages: `BreadcrumbList`.
  - FAQ markup is optional; Google shows FAQ rich results only for authoritative government and health sites, so don't count on it.
- **Bing Webmaster Tools:** verify the site (import from Search Console), submit the sitemap, and enable **IndexNow** (Cloudflare "Crawler Hints" or a post-deploy ping).
- **Search Console:** submit the sitemap; inspect 5 key URLs; keep the site included in generative AI features.
- **Performance:** check LCP of the homepage hero (many images inside the phone mockups). Preload the LCP asset; keep CLS < 0.1. Test with PageSpeed Insights on mobile.
- **Accessibility:** headings in order, alt text on content images (decorative mockup images keep `alt=""` as now), 44px tap targets, contrast.
- Real 404s stay real (already true).

---

## 8. Off-site presence and entity work (owner-led; Claude Code prepares the assets)

**One entity description, everywhere.** Use the same 1–2 sentences and the same name, "Lovio – Couples App & Widgets by FOURPLEX SIA", on the site, both store listings (first line), the press kit, Product Hunt, AlternativeTo, social bios and any directory. Keep the developer name identical on both stores. Consistency is how search engines and LLMs separate Lovio from Lovoo, LovOn and Lovora.

**Do in phase 1:**
1. **Store listings (ASO):** align the store wording with the site, fix the "real-time" claim, and keep screenshots current (Arcade, widgets). Add an in-app rating prompt after a positive moment (for example, after a streak milestone) if there isn't one. Rating count and recency help both store ranking and how AI describes the app.
2. **AlternativeTo:** list Lovio and mark it as an alternative to Widgetable, Locket Widget, Paired and Between.
3. **Product Hunt launch,** timed with the Arcade or the new site.
4. **Roundup outreach:** find the top 10 third-party pages ranking for "best couples apps", "best apps for long distance couples" and "couples widget app". Send each a short, honest pitch with the press-kit link. Pages from other app makers count only if they're fair. No paid placements disguised as reviews.
5. **Short-form video:** 15–30 s screen recordings of the drawing widget and Arcade for TikTok, Reels and **YouTube Shorts** (Google's AI features cite YouTube). Use real use and a real app.
6. **Communities:** founders may answer genuine questions in r/LongDistance, r/relationships and similar, **always disclosing the affiliation**, following each subreddit's rules, without astroturfing or sock-puppets.
7. **Wikidata:** only once there is independent coverage to cite; skip until then.

---

## 9. Measurement

- **Search Console + Bing Webmaster Tools:** impressions, clicks, queries per page, indexing status; Search Console's generative-AI report where available.
- **Page analytics:** **Cloudflare Web Analytics** (cookieless, free, one script tag). Check the privacy policy wording.
- **Store-click counting in the Worker:** in `cloudflare-worker/src/index.js`, log each `/go/*` hit (platform, `Referer` path, utm params, timestamp) to **Workers Analytics Engine**. That gives clicks per page with no client-side events and no personal data. Keep the redirect behaviour unchanged.
- **iOS attribution:** App Store Connect counts campaign sources through `pt` (provider token) and `ct` (campaign) parameters. **Verify** whether the current `search.itunes.apple.com … &referrer=` handoff passes them. If not, append `pt`/`ct` (with `ct` set to the page slug). On Android the Play `referrer` already carries UTMs.
- **A click is not an install.** Installs come from App Store Connect / Play Console sources reports.
- **AI visibility check (monthly, manual):** run these 10 prompts in ChatGPT, Perplexity, Gemini and Google AI Mode, in a fresh session with the same country. Log whether Lovio appears, whether the description is accurate, and which URLs are cited:
  1. best couples app with widgets 2. app to send drawings to my partner's home screen 3. best apps for long distance couples 4. couples app with games to play together 5. daily questions app for couples 6. Widgetable alternative for couples 7. Locket alternative for couples 8. what is the Lovio app 9. Lovio vs Paired 10. couples app where one subscription covers both partners

  Track the trend over months, not single answers.

---

## 10. Content rules (unchanged from v1, condensed)

- Write for the reader first; the Lovio CTA comes after useful content. No filler intros.
- Original examples only; never paraphrase competitors' lists.
- Byline "Lovio Team" (owner to approve) and real dates; "updated" only after a substantive change.
- No invented stats, studies, testimonials, expert reviews, user counts or health claims. Cite sources for factual claims.
- Each page targets one distinct intent; merge rather than publish near-duplicates.
- Vary page structure; don't stamp the same template 13 times.
- AI-assisted drafting is fine, but a human who knows the product reviews every page before `draft: false`.

---

## 11. Acceptance checklist

- [ ] Existing pages render pixel-identical after the Eleventy migration; `/go/ios`, `/go/android`, `/privacy`, `/terms`, `/download/`, `/invite/` and `/.well-known/*` respond exactly as before.
- [ ] Every published page returns 200, with a unique title, description, H1 and canonical; unknown routes return 404.
- [ ] `sitemap.xml` lists published pages only; `robots.txt` references it.
- [ ] JSON-LD validates (Rich Results Test / validator.schema.org) and matches the visible content; no `aggregateRating`.
- [ ] No orphan pages; every feature page links to ≥1 article and ≥1 other feature page; every article links to exactly one main feature page.
- [ ] Mobile and desktop checked for the homepage, one feature page, one article and one comparison.
- [ ] Worker click logging works and redirects are unchanged (test with curl, with and without utm params).
- [ ] `docs/seo/product-claims.md` has evidence for every product claim on published pages; `launch-checklist.md` records the results and the owner tasks.

---

## 12. Owner inputs needed (blockers)

1. Approved app screenshots or screen recordings (widgets on both OSes, Arcade, Daily Spark, date swiping).
2. The final wording for drawing-widget timing (the "real-time" claim).
3. The free vs Premium matrix per platform.
4. Byline choice, company city, and real social profile URLs for `sameAs`.
5. A decision on AI training crawlers (allow or block `GPTBot`, `ClaudeBot`, `Google-Extended`).
6. Access: switch GitHub Pages to Actions deploys; Cloudflare dashboard (managed robots.txt, AI Crawl Control, Web Analytics, Analytics Engine binding); Bing Webmaster Tools.

---

## 13. Order of work

1. **Week 1:** Eleventy migration with no visual change → robots, sitemap, JSON-LD, homepage title and entity line → Bing + IndexNow → Worker click logging + Web Analytics.
2. **Week 2–3:** 5 feature pages + About + Press → 4 articles → Blog hub.
3. **Week 3–4:** 2 comparisons (after evidence is logged) → Compare hub.
4. **In parallel from week 1:** store listing alignment, AlternativeTo, roundup outreach, short videos.
5. **Monthly:** Search Console / Bing review, AI prompt log, then choose phase-2 pages from the actual impression data.

---

## 14. Prompt for Claude Code

> Read `docs/seo/IMPLEMENTATION_MANUAL.md` in full. Implement §5 (Eleventy migration with zero visual change, preserving every existing URL, `.well-known` files and the `/go/*` Worker), then §7 technical SEO, the §6 homepage changes, the feature pages, About, Press, articles and comparisons. Write original, accurate copy; set `draft: true` on any page whose claims lack evidence in `docs/seo/product-claims.md`. Add the §9 Worker click logging without changing redirect behaviour. Run the §11 checklist, record the results in `docs/seo/launch-checklist.md`, and report the changed files, published URLs, draft URLs with their blockers, and the owner tasks from §12. Don't claim to have deployed, indexed or connected anything without evidence.

---

### Sources consulted for this revision
- Google, Optimizing for generative AI features: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- App Store lookup API (Lovio, US): https://itunes.apple.com/lookup?id=6743631737&country=us
- Live checks of getlovio.app (robots.txt, sitemap, status codes, bot user agents), 6 Nov 2026
- Couples-widget market scan: Paint Love, Couple Widget +, Noteit, drawn, duolove, Loveya, Locket (AlternativeTo), Lovebox Widget (App Store / store aggregators)
- Couples-app SERP scan: cupla.app, habi.app, marriage.com, ioshacker.com, connectedcouples.app and multiple `*.pages.dev` vendor listicles
- AI citation studies (vendor research, treat as directional): Ahrefs summary via eyefuldigital.squarespace.com, BrightEdge summary via stanventures.com, promptwatch.com
