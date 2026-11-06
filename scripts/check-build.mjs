// Post-build checks for _site/. Run with `npm run check` after `npm run build`.
// Fails (exit 1) on anything that would hurt indexing or break existing URLs.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PASSTHROUGH } = require("../eleventy.config.js");

const OUT = "_site";
const SITE = "https://getlovio.app";
const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });
}

// 1. Hand-written files are copied byte-for-byte.
for (const src of PASSTHROUGH) {
    const files = statSync(src).isDirectory() ? walk(src) : [src];
    for (const file of files) {
        if (file.endsWith(".DS_Store")) continue;
        const out = join(OUT, file);
        if (!existsSync(out)) fail(`missing in build: ${file}`);
        else if (!readFileSync(file).equals(readFileSync(out))) fail(`changed in build: ${file}`);
    }
}

// 2. robots.txt points at the sitemap.
const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("robots.txt has no Sitemap line");
if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt disallows the whole site");

// 3. Every sitemap URL maps to a built, indexable page with a matching canonical.
const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) fail("sitemap.xml is empty");
if (new Set(locs).size !== locs.length) fail("sitemap.xml has duplicate URLs");

const titles = new Map();
const descriptions = new Map();

for (const loc of locs) {
    if (!loc.startsWith(`${SITE}/`)) {
        fail(`sitemap URL not on ${SITE}: ${loc}`);
        continue;
    }
    const path = loc.slice(SITE.length);
    const file = join(OUT, path.endsWith("/") ? `${path}index.html` : path);
    if (!existsSync(file)) {
        fail(`sitemap URL has no page: ${loc}`);
        continue;
    }
    const html = readFileSync(file, "utf8");
    const where = relative(OUT, file);

    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) fail(`${where}: in sitemap but noindex`);

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== loc) fail(`${where}: canonical ${canonical ?? "(none)"} ≠ ${loc}`);

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]?.trim();
    if (!title) fail(`${where}: no <title>`);
    if (!desc) fail(`${where}: no meta description`);
    if (title && titles.has(title)) fail(`${where}: duplicate title with ${titles.get(title)}`);
    if (desc && descriptions.has(desc)) fail(`${where}: duplicate description with ${descriptions.get(desc)}`);
    titles.set(title, where);
    descriptions.set(desc, where);

    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1) fail(`${where}: ${h1s.length} <h1> elements`);
}

// 4. All JSON-LD blocks parse.
for (const file of walk(OUT).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
            const data = JSON.parse(json);
            if (JSON.stringify(data).includes("aggregateRating")) {
                fail(`${relative(OUT, file)}: aggregateRating is not allowed (store ratings are third-party)`);
            }
        } catch (err) {
            fail(`${relative(OUT, file)}: invalid JSON-LD (${err.message})`);
        }
    }
}

if (errors.length) {
    console.error(`✗ ${errors.length} problem(s):\n  - ${errors.join("\n  - ")}`);
    process.exit(1);
}
console.log(`✓ build OK — ${locs.length} sitemap URLs, passthrough files identical, JSON-LD valid`);
