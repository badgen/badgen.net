const MIN_BADGE_CACHE_SECONDS = 300

export function resolveBadgeCacheMaxAge (
  cache: string | string[] | undefined,
  fallbackSeconds: number
): number {
  const cacheValue = Array.isArray(cache) ? cache[0] : cache

  if (cacheValue === undefined) {
    return fallbackSeconds
  }

  const parsedCacheSeconds = parseInt(String(cacheValue), 10)
  if (Number.isNaN(parsedCacheSeconds)) {
    return MIN_BADGE_CACHE_SECONDS
  }

  return Math.max(parsedCacheSeconds, MIN_BADGE_CACHE_SECONDS)
}

export function createBadgeCacheControlHeader (cacheSeconds: number): string {
  return `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`
}
