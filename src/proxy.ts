import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { FP_COOKIE, FP_PASSWORD, FP_PATH } from './app/unlock/finance-platform/config'

const PASSWORD = 'hireme'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/password')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('portfolio-auth')

  if (cookie?.value !== PASSWORD) {
    return NextResponse.redirect(new URL('/password', request.url))
  }

  // Finance Platform case study has its own, second password
  if (pathname === FP_PATH || pathname.startsWith(FP_PATH + '/')) {
    if (request.cookies.get(FP_COOKIE)?.value !== FP_PASSWORD) {
      return NextResponse.redirect(new URL('/unlock/finance-platform', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg|jpg|jpeg|gif|webp)$).*)'],
}
