// Comparison pages are drafts until their competitor claims are logged in
// docs/seo/product-claims.md. Drafts aren't built unless DRAFTS=1 is set
// (preview with `DRAFTS=1 npm run serve`), and then they're noindex.
module.exports = {
    layout: "layouts/article.njk",
    type: "compare",
    section: "compare",
    sitemap: true,
    breadcrumbs: [],
    // Date the competitor facts were checked; update when re-verified.
    publishedAt: "2026-11-06",
    eleventyComputed: {
        permalink: (data) =>
            data.draft && !process.env.DRAFTS ? false : `/compare/${data.page.fileSlug}/`,
    },
};
