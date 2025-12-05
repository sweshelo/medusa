import { createClient } from './server'

export interface UserSubscription {
  id: string
  status: string
  priceId: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export async function getUserSubscription(): Promise<UserSubscription | null> {
  const supabase = await createClient()

  // ユーザーを取得
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log(user)

  if (authError || !user) {
    return null
  }

  // アクティブなサブスクリプションを取得
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, status, price_id, current_period_end, cancel_at_period_end')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .single()

  console.error(error)

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    status: data.status,
    priceId: data.price_id,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
  }
}
