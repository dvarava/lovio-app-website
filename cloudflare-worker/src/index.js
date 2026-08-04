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

export default {
    async fetch(request) {
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
