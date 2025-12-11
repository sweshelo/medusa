'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CURRENT_TERMS_VERSION } from '@/constants/terms'
import { createClient } from '@/service/supabase/server'

export async function agreeToTerms(redirectPath?: string) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Update the agreed_terms field
  const { error } = await supabase
    .from('profiles')
    .update({ agreed_terms: CURRENT_TERMS_VERSION })
    .eq('id', user.id)

  if (error) {
    throw new Error(`Failed to update terms agreement: ${error.message}`)
  }

  // Set cookie to cache the agreement (7 days)
  const cookieStore = await cookies()
  cookieStore.set('terms_agreed', CURRENT_TERMS_VERSION, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: '/',
  })

  // Redirect to the intended page or home
  redirect(redirectPath || '/')
}
