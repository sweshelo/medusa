import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/forgot-password-form'
import { requestPasswordReset } from './actions'

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg">
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
