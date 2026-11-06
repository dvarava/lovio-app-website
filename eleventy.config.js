// Eleventy builds the site into _site/ for GitHub Pages.
//
// The original hand-written pages (index.html, privacy.html, …) are copied
// byte-for-byte; Eleventy only renders templates under src/ (sitemap now,
// feature pages and articles later). `npm run check` verifies the copies.

const PASSTHROUGH = [
    "index.html",
    "404.html",
    "feedback.html",
    "privacy.html",
    "support.html",
    "terms.html",
    "download",
    "invite",
    "assets",
    ".well-known",
    "styles.css",
    "content.css",
    "home.css",
    "site.js",
    "favicon.ico",
    "robots.txt",
    "CNAME",
    ".nojekyll",
];

module.exports = function (eleventyConfig) {
    for (const path of PASSTHROUGH) {
        eleventyConfig.addPassthroughCopy({ [path]: path });
    }

    // Pages opt into the sitemap with `sitemap: true` in their front matter.
    eleventyConfig.addCollection("sitemap", (api) =>
        api.getAll().filter((item) => item.data.sitemap === true && item.data.draft !== true),
    );

    eleventyConfig.addFilter("readableDate", (iso) =>
        new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
    );

    eleventyConfig.addFilter("whereData", (items, key, value) =>
        (items || []).filter((item) => item.data[key] === value && !item.data.draft),
    );

    // Pages listed by URL in front matter (`related: [/features/…/]`) → page objects.
    eleventyConfig.addFilter("pagesByUrl", (urls, all) =>
        (urls || []).map((url) => {
            const found = all.find((item) => item.url === url && !item.data.draft);
            if (!found) throw new Error(`related link to missing or draft page: ${url}`);
            return found;
        }),
    );

    return {
        dir: { input: "src", output: "_site" },
        templateFormats: ["njk", "md"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};

module.exports.PASSTHROUGH = PASSTHROUGH;
