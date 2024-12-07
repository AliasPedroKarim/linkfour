import NextAuth from "next-auth"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest) => {
  const isLoggedIn = !!req.auth?.user
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')

  if ((isApiRoute || isDashboardRoute) && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', req.nextUrl))
  }
  return null
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}