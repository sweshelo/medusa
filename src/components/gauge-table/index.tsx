import { TZDate, tz } from '@date-fns/tz'
import { format } from 'date-fns'
import { fetchSchedule } from '@/service/supabase/schedule'
import type { RankRecord } from '@/types/record'
import { GaugeTableClient } from './client'

interface RecordsTableProps {
  records: RankRecord[]
}

export interface DailyStats {
  count: number
  totalDiff: number
  avgDiff: number
  mostFrequentChara: string | null
}

export interface Schedule {
  started_at: string | null
  ended_at: string | null
  even_time: string | null
  odd_time: string | null
}

// レコードを日付毎にグループ化
const groupByDate = (records: RankRecord[]) => {
  const grouped = new Map<string, RankRecord[]>()
  for (const record of records) {
    if (!record.recorded_at) continue
    const date = format(new TZDate(`${record.recorded_at}+09:00`), 'yy/MM/dd', {
      in: tz('Asia/Tokyo'),
    })
    if (!grouped.has(date)) {
      grouped.set(date, [])
    }
    grouped.get(date)?.push(record)
  }
  return grouped
}

// メインコンポーネント（サーバーコンポーネント）
export const GaugeTable = async ({ records }: RecordsTableProps) => {
  const schedule = await fetchSchedule()
  const groupedRecords = groupByDate(records)

  return (
    <GaugeTableClient groupedRecords={groupedRecords} schedule={schedule} />
  )
}
