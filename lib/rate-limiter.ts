// lib/rate-limiter.ts
import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
// Note: In production with multiple instances, use Redis instead
const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 ticket submissions per minute per IP

/**
 * Extract client IP from request headers
 * Works with various reverse proxies and hosting providers
 */
function getClientIp(request: NextRequest): string {
  // Try x-forwarded-for first (most common)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs: client, proxy1, proxy2, ...
    // The first IP is the original client
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    return ips[0];
  }

  // Try x-real-ip (used by nginx)
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Try Cloudflare's header
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Try Vercel's header
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  // Fallback to unknown (shouldn't happen in production)
  return "unknown";
}

/**
 * Rate limit function
 * Returns success status, remaining requests, and reset time
 */
export function rateLimit(request: NextRequest): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const ip = getClientIp(request);
  const now = Date.now();

  const existing = rateLimitMap.get(ip);

  // If no existing entry or window has expired, create new entry
  if (!existing || now > existing.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Check if rate limit exceeded
  if (existing.count >= MAX_REQUESTS) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  // Increment count
  existing.count += 1;
  rateLimitMap.set(ip, existing);

  return {
    success: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Cleanup old entries periodically
 * Call this on a small percentage of requests to prevent memory leaks
 */
export function maybeCleanup(): void {
  // Only run cleanup on 1% of requests
  if (Math.random() > 0.01) {
    return;
  }

  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}