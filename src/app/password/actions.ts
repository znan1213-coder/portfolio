'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function authenticate(_: unknown, formData: FormData) {
  const password = formData.get('password') as string

  if (password === 'hireme') {
    const cookieStore = await cookies()
    cookieStore.set('portfolio-auth', 'hireme', {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    })
    redirect('/')
  }

  return { error: 'Incorrect password.' }
}
