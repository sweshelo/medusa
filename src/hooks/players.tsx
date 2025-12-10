'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getAllPlayersName } from '@/app/settings/actions'

type PlayersContextType = {
  players: string[]
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined)

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<string[]>([])

  useEffect(() => {
    getAllPlayersName().then((names) => setPlayers(names))
  }, [])

  return (
    <PlayersContext.Provider value={{ players }}>
      {children}
    </PlayersContext.Provider>
  )
}

export const usePlayers = () => {
  const context = useContext(PlayersContext)
  if (!context) {
    throw new Error('usePlayers must be used within a DrawerProvider')
  }
  return context
}
