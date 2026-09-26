'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FP_COOKIE, FP_PASSWORD, FP_PATH } from './config'

export async function unlockFinancePlatform(_: unknown, formData: FormData) {
  const password = (formData.get('password') as string | null)?.trim()

  if (password === FP_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(FP_COOKIE, FP_PASSWORD, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    })
    redirect(FP_PATH)
  }

  return { error: 'Incorrect password.' }
}
