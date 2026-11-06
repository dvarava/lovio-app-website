module.exports = {
    url: "https://getlovio.app",
    // Bump when styles.css, content.css or site.js change so Cloudflare serves fresh copies.
    assetVersion: "20261106",
    // Hand-written pages that are copied as-is and should be indexed.
    // /download/ and /invite/ are noindex, so they stay out of the sitemap.
    staticPages: ["/", "/support.html", "/feedback.html", "/privacy.html", "/terms.html"],
    nav: [
        { label: "Widgets", url: "/features/couples-widgets/", section: "widgets" },
        { label: "Games", url: "/features/couples-games/", section: "games" },
        { label: "Long distance", url: "/features/long-distance/", section: "long-distance" },
        { label: "Guides", url: "/blog/", section: "blog" },
        { label: "Support", url: "/support.html" },
    ],
    publisher: "FOURPLEX SIA",
    author: "The Lovio team",
};
