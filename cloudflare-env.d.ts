/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
	ASSETS: Fetcher;
	WORKER_SELF_REFERENCE: Fetcher;
	NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
	PUZZLES_KV: KVNamespace;
	NEXTJS_ENV: string;
	IMAGES: unknown;
}
