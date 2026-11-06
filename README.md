# getlovio.app

Marketing site for Lovio, built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```bash
npm install
npm run serve            # http://localhost:8765, live reload
DRAFTS=1 npm run serve   # also builds draft pages (noindex)
npm run ci               # build + SEO/link checks (runs in CI)
```

- **Hand-written pages** (`index.html`, `support.html`, `privacy.html`, `terms.html`, `feedback.html`, `download/`, `invite/`, `404.html`) live at the repo root and are copied unchanged.
- **Templated pages** live in `src/`: features in `src/features/`, guides in `src/blog/`, comparisons in `src/compare/`. Layouts are in `src/_includes/layouts/`.
- New Markdown pages get their layout, sitemap entry, breadcrumbs and JSON-LD from the folder's `*.11tydata.js` file. Set `related:` to 2–3 URLs and `faq:` for the FAQ block.
- `draft: true` keeps a page out of the build and the sitemap.
- Store links always go through `/go/ios` and `/go/android` (the Cloudflare Worker in `cloudflare-worker/`); add `?placement=<name>` to tell buttons apart in click stats.
- SEO plan and owner tasks: `docs/seo/`.
