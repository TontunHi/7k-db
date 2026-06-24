import { LRUCache } from "lru-cache"
import { headers } from "next/headers"

const cache = new LRUCache<string, number[]>({
    max: 1000,
    ttl: 1000 * 60 * 15, // Cache history for 15 minutes max
})

interface RateLimitConfig {
    limit: number        // Maximum allowed requests in the window
    windowMs: number     // Window duration in milliseconds
}

/**
 * rateLimit - Basic In-Memory sliding-window rate limiter using LRUCache.
 * Returns information about the rate limit status.
 */
export function rateLimit(ip: string, config: RateLimitConfig): { success: boolean; limit: number; remaining: number } {
    const now = Date.now()
    const requestTimes = cache.get(ip) || []

    // Filter out requests that are older than the sliding window
    const windowStart = now - config.windowMs
    const activeRequests = requestTimes.filter(time => time > windowStart)

    if (activeRequests.length >= config.limit) {
        return {
            success: false,
            limit: config.limit,
            remaining: 0
        }
    }

    activeRequests.push(now)
    cache.set(ip, activeRequests)

    return {
        success: true,
        limit: config.limit,
        remaining: config.limit - activeRequests.length
    }
}

/**
 * Retrieve client IP address securely from standard request headers.
 */
export async function getClientIp(): Promise<string> {
    const headersList = await headers()
    const xForwardedFor = headersList.get("x-forwarded-for")
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim()
    }
    return "127.0.0.1"
}
