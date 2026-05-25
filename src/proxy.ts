import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg|jpg|jpeg|gif|webp)$).*)'],
}
