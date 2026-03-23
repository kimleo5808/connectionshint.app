/**
 * Shared KV accessor for all data modules.
 *
 * At build time (SSG/prerender) getCloudflareContext is unavailable,
 * so we detect that once and cache the result.  At runtime the KV
 * namespace is resolved from the Cloudflare Worker env.
 */

let _kvCache: KVNamespace | null = null;
let _buildMode: boolean | null = null;

export async function getKV(): Promise<KVNamespace | null> {
  if (_buildMode === true) return null;

  if (_kvCache) return _kvCache;

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext();
    _kvCache = (env as CloudflareEnv).PUZZLES_KV;
    return _kvCache;
  } catch {
    // Build time — no Worker runtime available
    _buildMode = true;
    return null;
  }
}
