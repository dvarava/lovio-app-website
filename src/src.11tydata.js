// Applies to every template under src/. Builds each page's JSON-LD from its
// front matter so the structured data always matches what the page shows.

const SITE = "https://getlovio.app";
const ORG = { "@id": `${SITE}/#organization` };

function breadcrumbList(data) {
    if (!data.breadcrumbs) return null;
    const items = [{ name: "Home", url: `${SITE}/` }]
        .concat(data.breadcrumbs.map((c) => ({ name: c.label, url: SITE + c.url })))
        .concat([{ name: data.crumbLabel || data.h1, url: SITE + data.page.url }]);
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

module.exports = {
    eleventyComputed: {
        jsonLd: (data) => {
            if (!data.title || !data.page || !data.page.url) return "";
            const url = SITE + data.page.url;
            const graph = [];

            if (data.type === "article") {
                graph.push({
                    "@type": "BlogPosting",
                    headline: data.h1,
                    description: data.description,
                    url,
                    mainEntityOfPage: url,
                    datePublished: data.publishedAt,
                    dateModified: data.updatedAt || data.publishedAt,
                    image: data.heroImage ? SITE + data.heroImage : `${SITE}/assets/og-image.png`,
                    author: { "@type": "Organization", name: "Lovio", url: `${SITE}/about/` },
                    publisher: { "@type": "Organization", name: "FOURPLEX SIA", url: `${SITE}/`, logo: `${SITE}/assets/icon.png` },
                });
            } else {
                graph.push({
                    "@type": data.schemaType || "WebPage",
                    name: data.h1,
                    description: data.description,
                    url,
                    isPartOf: { "@id": `${SITE}/#website` },
                    publisher: ORG,
                    ...(data.type === "feature" ? { about: { "@id": `${SITE}/#app` } } : {}),
                });
            }

            const crumbs = breadcrumbList(data);
            if (crumbs) graph.push(crumbs);

            // Escape "<" so content can never close the <script> element.
            return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
        },
    },
};
