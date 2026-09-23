import { Redis } from "@upstash/redis";

export class RedisNotConfiguredError extends Error {
  constructor(context = "This feature") {
    super(`${context} requires Redis, but no supported Redis environment variables are configured.`);
    this.name = "RedisNotConfiguredError";
  }
}

let redis: Redis | null | undefined;

/**
 * One Redis connection for orders, e-book publications, entitlements,
 * access links, and reading progress. The three environment-variable
 * pairs mirror the names used by Upstash and Vercel Marketplace.
 */
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? process.env.ADESEUN_WEBSITE_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.ADESEUN_WEBSITE_KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error("Redis is not configured. Redis-backed features are unavailable.");
    redis = null;
    return redis;
  }

  redis = new Redis({ url, token });
  return redis;
}

export function requireRedis(context?: string): Redis {
  const client = getRedis();
  if (!client) throw new RedisNotConfiguredError(context);
  return client;
}
