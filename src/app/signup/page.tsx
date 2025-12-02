import { SignupForm } from '@/features/auth/signup-form'

import { signup } from './actions'

export default function SignupPage() {
  return (
    <div className="flex justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            新規登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ユーザアカウントを登録する
          </p>
        </div>

        <SignupForm onSubmit={signup} />
      </div>
    </div>
  )
}
