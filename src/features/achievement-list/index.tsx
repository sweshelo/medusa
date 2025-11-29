'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { AchievementPanel } from '@/features/achievement-panel'
import { AchievementInfo } from '@/service/scraping/achievement'
import { Database } from '@/types/database.types'
import { toHalfWidth } from '@/utils/text'

interface AchievementListProps {
  achievements: Database['public']['Tables']['achievement']['Row'][]
  infomations: AchievementInfo[]
}

const CATEGORIES = [
  { value: 'all', label: '全て' },
  { value: 'common', label: '共通' },
  { value: 'action', label: 'アクション' },
  { value: 'stage', label: 'ステージ' },
  { value: 'shop', label: 'ショップ' },
  { value: 'tower', label: 'タワー' },
  { value: 'event', label: 'イベント' },
  { value: 'prefecture', label: '都道府県' },
  { value: 'ranking', label: 'ランキング' },
] as const

export const AchievementList = ({ achievements, infomations }: AchievementListProps) => {
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag') || 'all'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAchievements = useMemo(() => {
    let result = achievements

    // カテゴリフィルタ
    if (selectedTag !== 'all') {
      result = result.filter(achievement => {
        const info = infomations.find(info => {
          // 半角に変換したタイトルと比較
          const normalizedTitle = achievement.title.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0)
          )
          return info.title === normalizedTitle
        })
        return info?.tag === selectedTag
      })
    }

    // 検索フィルタ
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        achievement =>
          toHalfWidth(achievement.title.toLowerCase()).includes(query) ||
          toHalfWidth(achievement.discoverer?.toLowerCase() || '').includes(query)
      )
    }

    return result
  }, [achievements, infomations, selectedTag, searchQuery])

  return (
    <>
      <div className="bg-white text-center py-2 mb-2 rounded-lg">
        <span className="text-sm text-gray-600">
          閻魔帳に記録された称号一覧です
          <br />
          クリックすると詳細を開閉します
        </span>
      </div>

      {/* 絞り込みUI */}
      <details className="bg-white rounded-lg mb-4" open>
        <summary className="cursor-pointer p-3 hover:bg-gray-50 rounded-lg list-none">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">🔍 絞り込み・検索</span>
            <span className="text-xs text-gray-500">
              {selectedTag !== 'all' || searchQuery ? (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {filteredAchievements.length}件
                </span>
              ) : (
                'クリックで開く'
              )}
            </span>
          </div>
        </summary>

        <div className="p-3 pt-0 space-y-4">
          {/* 検索ボックス */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              称号名またはプレイヤー名で検索
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="キーワードを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* カテゴリ選択 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">カテゴリで絞り込み</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(category => (
                <Link
                  key={category.value}
                  href={
                    category.value === 'all'
                      ? '/achievements'
                      : `/achievements?tag=${category.value}`
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 結果表示 */}
          {(selectedTag !== 'all' || searchQuery) && (
            <div className="text-center text-sm text-gray-600 pt-2 border-t border-gray-200">
              {filteredAchievements.length}件の称号が見つかりました
            </div>
          )}
        </div>
      </details>

      {/* 称号リスト */}
      <div>
        {filteredAchievements.map(achievement => (
          <AchievementPanel
            achievement={achievement}
            infomations={infomations}
            key={achievement.id}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          該当する称号が見つかりませんでした
        </div>
      )}
    </>
  )
}
