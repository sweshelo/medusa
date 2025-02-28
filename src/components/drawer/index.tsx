'use client'

import Link from 'next/link'

import { useDrawer } from '@/hooks/drawer'

export const Drawer = () => {
  const { isOpen, closeDrawer } = useDrawer()

  return (
    <div>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[1000] ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeDrawer}
      />

      {/* ドロワー本体 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform z-[2000] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-full bg-red-900">
          <div className="max-w-[800px] mx-auto p-4 flex items-center space-x-4">
            <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center bg-[url('/image/icon.png')] bg-contain" />
            <div>
              <h1 className="text-white text-2xl font-bold">閻魔帳</h1>
              <p className="text-gray-300 text-xs">v2 &quot;medusa&quot; - @sweshelo</p>
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
            <Link href="/search" className="block p-2 hover:bg-gray-100">
              プレイヤー検索
            </Link>
          </li>
          <li>
            <Link href="/online" className="block p-2 hover:bg-gray-100">
              オンライン
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
