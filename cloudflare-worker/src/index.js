const TRACKING_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "fbclid",
];

const STORE_URLS = {
    // This is Apple’s native App Store handoff endpoint. Instagram handles it
    // correctly, while apps.apple.com can leave its iOS in-app browser on a
    // blank page when Apple redirects again to the itms-appss:// scheme.
    "/go/ios": "https://search.itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=6743631737",
    "/go/android": "https://play.google.com/store/apps/details?id=com.fourplex.lovio",
};

// Counts store clicks in Workers Analytics Engine: which store, which page
// and button sent the click, and the campaign. No IP, cookie or user agent is
// stored. Logging is best-effort and can never block or change the redirect.
function logStoreClick(env, request, requestUrl, path) {
    if (!env || !env.STORE_CLICKS || request.method !== "GET") {
        return;
    }

    try {
        const platform = path === "/go/ios" ? "ios" : "android";
        let sourcePath = "(direct)";
        const referer = request.headers.get("Referer");

        if (referer) {
            const refererUrl = new URL(referer);
            sourcePath = refererUrl.hostname === requestUrl.hostname
                ? refererUrl.pathname
                : refererUrl.hostname;
        }

        const param = (key) => (requestUrl.searchParams.get(key) || "").slice(0, 100);

        env.STORE_CLICKS.writeDataPoint({
            indexes: [platform],
            blobs: [
                platform,
                sourcePath.slice(0, 200),
                param("placement"),
                param("utm_source"),
                param("utm_medium"),
                param("utm_campaign"),
                param("utm_content"),
                (request.cf && request.cf.country) || "",
            ],
            doubles: [1],
        });
    } catch (error) {
        // Never let analytics break the redirect.
    }
}

export default {
    async fetch(request, env) {
        if (request.method !== "GET" && request.method !== "HEAD") {
            return new Response("Method Not Allowed", {
                status: 405,
                headers: { Allow: "GET, HEAD" },
            });
        }

        const requestUrl = new URL(request.url);
        const path = requestUrl.pathname.replace(/\/+$/, "") || "/";
        const storeUrl = STORE_URLS[path];

        if (!storeUrl) {
            return new Response("Not Found", { status: 404 });
        }

        logStoreClick(env, request, requestUrl, path);

        const destination = new URL(storeUrl);
        const trackingParams = new URLSearchParams();

        TRACKING_KEYS.forEach((key) => {
            const value = requestUrl.searchParams.get(key);

            if (value !== null) {
                trackingParams.set(key, value);
            }
        });

        if (path === "/go/ios") {
            const referrer = trackingParams.toString();

            if (referrer) {
                destination.searchParams.set("referrer", referrer);
            }
        } else {
            trackingParams.forEach((value, key) => {
                destination.searchParams.set(key, value);
            });
        }

        return new Response(null, {
            status: 302,
            headers: {
                Location: destination.toString(),
                "Cache-Control": "no-store",
            },
        });
    },
};
