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

    return {
        dir: { input: "src", output: "_site" },
        templateFormats: ["njk", "md"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};

module.exports.PASSTHROUGH = PASSTHROUGH;
