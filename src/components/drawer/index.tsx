'use client'

import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useDrawer } from '@/hooks/drawer'
import { getUser } from './actions'

export const Drawer = () => {
  const { isOpen, closeDrawer } = useDrawer()
  const [user, setUser] = useState<User>()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handlePathChange = useCallback(() => {
    getUser().then((user) => setUser(user))
  }, [])

  useEffect(() => {
    if (searchParams.get('login') === 'success' || pathname === 'login')
      handlePathChange()
  }, [searchParams, pathname, handlePathChange])

  useEffect(handlePathChange, [])

  return (
    <div>
      {/* オーバーレイ */}
      <button
        className={`fixed inset-0 bg-black/50 transition-opacity z-1000 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        type="button"
        onClick={closeDrawer}
      />

      {/* ドロワー本体 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform z-2000 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-full bg-red-900">
          <div className="max-w-[800px] mx-auto p-4 flex items-center space-x-4">
            <button
              className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center bg-[url('/image/icon.png')] bg-contain cursor-pointer"
              type="button"
            />
            <div>
              <h1 className="text-white text-2xl font-bold">閻魔帳</h1>
              <p className="text-gray-300 text-xs">
                v2 &quot;medusa&quot; - @sweshelo
              </p>
            </div>
          </div>
        </div>
        <ul className="p-4 space-y-2">
          <li>
            <Link href="/ranking" className="block p-2 hover:bg-gray-100">
              ランキング
            </Link>
          </li>
          <li>
            <Link href="/deviation" className="block p-2 hover:bg-gray-100">
              偏差値ランキング
            </Link>
          </li>
          <li>
            <Link href="/play" className="block p-2 hover:bg-gray-100">
              プレイ数ランキング
            </Link>
          </li>
          <li>
            <Link href="/prefecture" className="block p-2 hover:bg-gray-100">
              制県度ランキング
            </Link>
          </li>
          <li>
            <Link href="/search" className="block p-2 hover:bg-gray-100">
              プレイヤー検索
            </Link>
          </li>
          <li>
            <Link href="/achievements" className="block p-2 hover:bg-gray-100">
              称号一覧
            </Link>
          </li>
          <li>
            <Link href="/online" className="block p-2 hover:bg-gray-100">
              オンライン
            </Link>
          </li>
          {user ? (
            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                ログインユーザ専用
              </p>
              <div className="border my-1" />
              <li>
                <Link href="/pekora" className="block p-2 hover:bg-gray-100">
                  画像記録機能
                </Link>
              </li>
              <li>
                <Link href="/donation" className="block p-2 hover:bg-gray-100">
                  御布施
                </Link>
              </li>
              <li>
                <Link href="/settings" className="block p-2 hover:bg-gray-100">
                  設定
                </Link>
              </li>
            </div>
          ) : (
            <li>
              <Link href="/login" className="block p-2 hover:bg-gray-100">
                ログイン
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
