'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export function ToastTrigger() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const login = searchParams.get('login')
    const error = searchParams.get('error')

    if (login === 'success') {
      toast.success('ログインしました')
    } else if (error === 'auth_failed') {
      toast.error('認証に失敗しました')
    }
  }, [searchParams])

  return null
}
