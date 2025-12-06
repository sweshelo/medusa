'use client'

import Link from 'next/link'
import { useDrawer } from '@/hooks/drawer'

export const Header = () => {
  const { openDrawer } = useDrawer()

  return (
    <div className="w-full bg-red-900">
      <div className="max-w-[800px] mx-auto p-4 flex items-center space-x-4">
        <button
          className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center bg-[url('/image/icon.png')] bg-contain z-1 cursor-pointer"
          type="button"
          onClick={openDrawer}
        />
        <Link className="grow" href={'/'}>
          <h1 className="text-white text-2xl font-bold">閻魔帳</h1>
          <p className="text-gray-300 text-xs">
            v2 &quot;medusa&quot; - @sweshelo
          </p>
        </Link>
      </div>
    </div>
  )
}
