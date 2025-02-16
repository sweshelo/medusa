'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import action from './action'
import { PlayerCard } from '../player/card'

export const SearchBox = () => {
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<string[]>()

  useEffect(() => {
    action().then(players => setPlayers(players))
  }, [])

  // 半角文字を全角に変換
  const transform = useCallback(
    (query: string) =>
      query
        .toLowerCase()
        .replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0)),
    []
  )

  const filteredItems = useMemo(
    () =>
      players?.filter(player => {
        if (query.length <= 3) {
          return player.toLowerCase().includes(transform(query))
        } else {
          return player.toLowerCase().startsWith(transform(query))
        }
      }),
    [players, query, transform]
  )

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="プレーヤー名を入力…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        disabled={!players || players.length <= 0}
      />
      {!players && <p>プレーヤー一覧を取得しています…</p>}
      {players &&
        (players?.length > 0 ? (
          <ul>
            {query.length > 0 &&
              filteredItems?.map(player => (
                <li key={player} className="my-2">
                  <PlayerCard player={{ name: player }} />
                </li>
              ))}
          </ul>
        ) : (
          <p>プレーヤー一覧の取得に失敗しました</p>
        ))}
    </div>
  )
}
