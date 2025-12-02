'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LoginForm } from '@/features/auth/login-form'
import { MagicLinkForm } from '@/features/auth/magic-link-form'
import { login, sendMagicLink } from './actions'

type LoginMethod = 'password' | 'magic-link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string; reset?: string }
}) {
  const [activeTab, setActiveTab] = useState<LoginMethod>('password')
  const showRegisteredMessage = searchParams.registered === 'true'
  const showResetMessage = searchParams.reset === 'success'

  return (
    <div className="flex justify-center sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg">
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
          {showResetMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-800">
                パスワードを更新しました。新しいパスワードでログインしてください。
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              パスワード
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('magic-link')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'magic-link'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              マジックリンク
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'password' ? (
          <LoginForm onSubmit={login} />
        ) : (
          <MagicLinkForm onSubmit={sendMagicLink} />
        )}

        {activeTab === 'password' && (
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              パスワードを忘れた方はこちら
            </Link>
          </div>
        )}

        <div className="text-center pt-4 border-t border-gray-200">
          <Link
            href="/signup"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>
    </div>
  )
}
