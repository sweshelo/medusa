import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/forgot-password-form'
import { requestPasswordReset } from './actions'

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center bg-white">
      <div className="w-full space-y-8 p-3 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            パスワードリセット
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            登録したメールアドレスを入力してください。
            <br />
            パスワードリセット用のリンクを送信します。
          </p>
        </div>

        <ForgotPasswordForm onSubmit={requestPasswordReset} />

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
