'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getAllPlayersName } from '@/app/settings/actions'
import { fetchSchedule } from '@/service/supabase/schedule'
import type { Schedule } from '@/types/schedule'

type GameDataContextType = {
  players: string[]
  schedule: Schedule[]
}

const GameDataContext = createContext<GameDataContextType | undefined>(
  undefined,
)

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<string[]>([])
  const [schedule, setSchedule] = useState<Schedule[]>([])

  useEffect(() => {
    getAllPlayersName().then((names) => setPlayers(names))
    fetchSchedule().then((schedule) => setSchedule(schedule))
  }, [])

  return (
    <GameDataContext.Provider value={{ players, schedule }}>
      {children}
    </GameDataContext.Provider>
  )
}

export const useGameData = () => {
  const context = useContext(GameDataContext)
  if (!context) {
    throw new Error('useGameContext must be used within a DrawerProvider')
  }
  return context
}
