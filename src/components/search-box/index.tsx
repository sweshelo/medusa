'use client'

import { useEffect, useMemo, useState } from 'react'

import action from './action'
import { PlayerCard } from '../player/card'

export const SearchBox = () => {
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<string[]>()

  useEffect(() => {
    action().then(players => setPlayers(players))
  }, [])

  const filteredItems = useMemo(
    () =>
      players?.filter(player => {
        if (query.length <= 3) {
          return player
            .toLowerCase()
            .includes(
              query
                .toLowerCase()
                .replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
            )
        } else {
          return player
            .toLowerCase()
            .startsWith(
              query
                .toLowerCase()
                .replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
            )
        }
      }),
    [query, players]
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
