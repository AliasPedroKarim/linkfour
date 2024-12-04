import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdmin } from '@/lib/auth'
import { getRedisClient } from '@/lib/redis'

interface RateLimitResponse {
  allowed: boolean
  remaining: number
  reset: number
}

async function getRateLimit(ip: string): Promise<RateLimitResponse> {
  const redis = await getRedisClient()
  const key = `ratelimit:${ip}`
  const limit = 100 
  const window = 60 * 15

  const [requests, ttl] = await Promise.all([
    redis.incr(key),
    redis.ttl(key)
  ])

  if (requests === 1) {
    await redis.expire(key, window)
  }

  return {
    allowed: requests <= limit,
    remaining: Math.max(0, limit - requests),
    reset: ttl
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")

  // Protection des routes admin
  if (isAdminRoute) {
    if (!token?.email || !isAdmin({ email: token.email } as any)) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Vérification du bannissement
  if ((request.nextUrl.pathname.startsWith("/dashboard") || isApiRoute) && !isAuthRoute) {
    if (token?.sub) {
      const response = await fetch(
        `${request.nextUrl.origin}/api/users/${token.sub}/status`
      )
      const data = await response.json()

      if (data.isBanned) {
        if (isApiRoute) {
          return new NextResponse("Compte banni", { status: 403 })
        }
        return NextResponse.redirect(new URL("/banned", request.url))
      }
    }
  }

  // Rate limiting pour les routes API
  if (isApiRoute) {
    const clientIp = request.headers.get("x-forwarded-for") || 
                    request.headers.get("x-real-ip") || 
                    "127.0.0.1"
    const rateLimit = await getRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString()
        }
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|favicon.ico).*)",
  ],
} 