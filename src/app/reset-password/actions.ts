'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/service/supabase/server'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  if (!password || password.length < 8) {
    return { error: 'パスワードが短すぎます' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login?reset=success')
}
