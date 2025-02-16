'use client'

import { useEffect, useMemo, useState } from 'react'

import { Player } from '@/types/player'

import action from './action'
import { PlayerCard } from '../player/card'

export const SearchBox = () => {
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<(Player & { chara: string; ranking: number })[]>([])

  useEffect(() => {
    action().then(players => setPlayers(players))
  }, [])

  const filteredItems = useMemo(
    () =>
      players.filter(player => {
        if (query.length <= 3) {
          return player.name
            .toLowerCase()
            .includes(
              query
                .toLowerCase()
                .replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
            )
        } else {
          return player.name
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
      />
      <ul>
        {query.length > 0 &&
          filteredItems.map((player, index) => (
            <li key={index} className="my-2">
              <PlayerCard player={player} chara={player.chara} />
            </li>
          ))}
      </ul>
    </div>
  )
}
