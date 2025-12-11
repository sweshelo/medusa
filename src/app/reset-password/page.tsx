import { ResetPasswordForm } from '@/features/auth/reset-password-form'
import { resetPassword } from './actions'

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center bg-white">
      <div className="w-full space-y-8 p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            新しいパスワードの設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            新しいパスワードを入力してください。
          </p>
        </div>

        <ResetPasswordForm onSubmit={resetPassword} />
      </div>
    </div>
  )
}
