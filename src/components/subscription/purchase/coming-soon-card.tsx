import { FaLock } from 'react-icons/fa'

export const ComingSoonCard = () => {
  return (
    <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg border-2 border-gray-700 opacity-75">
      {/* 鍵アイコン */}
      <div className="mb-4 text-center">
        <FaLock className="text-5xl text-gray-400 mx-auto" />
      </div>

      {/* Coming Soonテキスト */}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-300">Coming Soon</h3>
      </div>

      {/* 説明 */}
      <div className="mb-6 text-center">
        <p className="text-gray-400">上位プランを準備中です</p>
      </div>

      {/* 無効化されたボタン */}
      <div className="mt-6">
        <button
          disabled
          type="button"
          className="block w-full py-3 px-6 text-center text-gray-500 font-bold bg-gray-700 rounded-lg cursor-not-allowed"
        >
          準備中
        </button>
      </div>
    </div>
  )
}
