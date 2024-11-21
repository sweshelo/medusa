import Link from 'next/link'

export const Header = () => {
  return (
    <Link href={'/'}>
      <div className="w-full bg-blue-900">
        <div className="max-w-[800] mx-auto p-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-white">閻</div>
          </div>
          <div className="flex-grow">
            <h1 className="text-white text-2xl font-bold">閻魔帳</h1>
            <p className="text-gray-300 text-sm">v2 - @sweshelo</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
