import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Prerendered pages are served from Workers static assets (a read-only
 * cache; files land under the worker-only cdn-cgi/_next_cache path).
 *
 * The R2 cache it replaces cost one Cloudflare API call per page on every
 * deploy, and this account's sister sites deploy around the same times, so
 * uploads could hit the account-wide 1,200-requests-per-5-minutes limit
 * (HTTP 429). Static assets go up in a few batched, resumable requests.
 *
 * Read-only is fine here because no page uses `revalidate`:
 *  - today / yesterday / list pages are force-dynamic and read KV on every
 *    request, so they never touched this cache;
 *  - prerendered pages only change on deploy, as before;
 *  - date pages outside the prerendered window (dynamicParams default) are
 *    rendered from KV on each request instead of being stored in R2.
 *
 * Don't copy this to a site that relies on `revalidate` (strandshint does):
 * a read-only cache would freeze those pages until the next deploy.
 */
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
