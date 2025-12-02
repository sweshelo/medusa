import { LoginForm } from '@/features/auth/login-form'

import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string }
}) {
  const showRegisteredMessage = searchParams.registered === 'true'

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            ログイン
          </h2>
          {showRegisteredMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-800">
                アカウント作成が完了しました。ログインしてください。
              </div>
            </div>
          )}
        </div>

        <LoginForm onSubmit={login} />
      </div>
    </div>
  )
}
