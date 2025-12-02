import { SignupForm } from '@/features/auth/signup-form'

import { signup } from './actions'

export default function SignupPage() {
  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            新規登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントを作成して、サービスをご利用ください
          </p>
        </div>

        <SignupForm onSubmit={signup} />
      </div>
    </div>
  )
}
