'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function ToastTrigger() {
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  useEffect(() => {
    const login = searchParams.get('login')
    const error = searchParams.get('error')

    if (login === 'success') {
      showToast('ログインしました', 'success')
    } else if (error === 'auth_failed') {
      showToast('認証に失敗しました', 'error')
    }
  }, [searchParams, showToast])

  return null
}
