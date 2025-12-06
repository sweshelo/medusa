'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAllPlayersName,
  linkPlayerToUser,
  unlinkPlayer,
} from '@/app/settings/actions'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard, PlayerView } from '@/components/player/card'

interface LinkPlayerProps {
  initialPlayer: { id: number; name: string } | null
}

export const LinkPlayer = ({ initialPlayer }: LinkPlayerProps) => {
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<string[]>()
  const [linkedPlayer, setLinkedPlayer] = useState<string | null>(
    initialPlayer?.name ?? null,
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    getAllPlayersName().then((players) => setPlayers(players))
  }, [])

  // 半角文字を全角に変換
  const transform = useCallback(
    (query: string) =>
      query
        .toLowerCase()
        .replace(/[A-Za-z0-9]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) + 0xfee0),
        ),
    [],
  )

  const filteredItems = useMemo(
    () =>
      players?.filter((player) => {
        if (query.length <= 3) {
          return player.toLowerCase().includes(transform(query))
        } else {
          return player.toLowerCase().startsWith(transform(query))
        }
      }),
    [players, query, transform],
  )

  const handleLinkPlayer = async (playerName: string) => {
    setLoading(true)
    setMessage(null)

    const result = await linkPlayerToUser(playerName)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setLinkedPlayer(result.playerName)
      setMessage({
        type: 'success',
        text: `${result.playerName}と紐づけました`,
      })
      setQuery('')
    }

    setLoading(false)
  }

  const handleUnlinkPlayer = async () => {
    if (!confirm('プレイヤーとの紐づけを解除しますか？')) {
      return
    }

    setLoading(true)
    setMessage(null)

    const result = await unlinkPlayer()

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setLinkedPlayer(null)
      setMessage({ type: 'success', text: '紐づけを解除しました' })
    }

    setLoading(false)
  }

  return (
    <div className="">
      <SmallHeadline title="プレイヤー連携" />
      <div className="bg-white rounded-lg py-3 my-2">
        {message && (
          <div
            className={`mb-4 p-3 rounded-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {linkedPlayer ? (
          <div className="p-3">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                紐づいているプレイヤー:
              </p>
              <PlayerCard player={{ name: linkedPlayer }} />
            </div>
            <button
              type="button"
              onClick={handleUnlinkPlayer}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : '紐づけを解除'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              プレイヤー名を検索して紐づけてください
            </p>
            <input
              type="text"
              placeholder="プレーヤー名を入力…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm mb-2"
              disabled={!players || players.length <= 0 || loading}
            />
            {!players && (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-gray-200 rounded-sm"></div>
                <div className="h-12 bg-gray-200 rounded-sm"></div>
                <div className="h-12 bg-gray-200 rounded-sm"></div>
              </div>
            )}
            {players &&
              (players?.length > 0 ? (
                <ul>
                  {query.length > 0 &&
                    filteredItems?.slice(0, 10).map((player) => (
                      <li key={player} className="my-2">
                        <button
                          type="button"
                          onClick={() => handleLinkPlayer(player)}
                          disabled={loading}
                          className="w-full text-left hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlayerView player={{ name: player }} />
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>プレーヤー一覧の取得に失敗しました</p>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
