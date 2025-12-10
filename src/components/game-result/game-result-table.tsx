'use client'

import { useState } from 'react'
import { updateGameResult } from '@/app/pekora/actions'
import type { Tables } from '@/types/database.types'
import { toFullWidth } from '@/utils/text'

type GameResult = Tables<'game_result'>

interface GameResultTableProps {
  results: GameResult[]
  players: string[]
  onUpdate?: () => void
}

const intToGameResult = (result: number) => {
  switch (result) {
    case 1:
      return '勝'
    case -1:
      return '負'
    case 0:
      return '引'
  }
}

const intToColorClass = (result: number) => {
  switch (result) {
    case 1:
      return 'text-amber-400 font-bold'
    case -1:
      return 'text-violet-900'
    case 0:
      return 'text-lime-500'
  }
}

export const GameResultTable = ({
  results,
  players,
  onUpdate,
}: GameResultTableProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedResults, setEditedResults] = useState<GameResult[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleEditClick = () => {
    setEditedResults([...results])
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedResults([])
  }

  const handleSave = async () => {
    setIsSaving(true)
    let hasError = false

    for (const result of editedResults) {
      const originalResult = results.find((r) => r.id === result.id)
      if (!originalResult) continue

      // Check if any field has changed
      const hasChanges = Object.keys(result).some((key) => {
        const k = key as keyof GameResult
        return result[k] !== originalResult[k]
      })

      if (hasChanges) {
        const { error } = await updateGameResult(result.id, {
          player_name: result.player_name,
          score: result.score,
          kill: result.kill,
          death: result.death,
          assist: result.assist,
          chain: result.chain,
          charge: result.charge,
          flight: result.flight,
          is_win: result.is_win,
          team: result.team,
          is_mvp: result.is_mvp,
        })

        if (error) {
          console.error(`Failed to update result ${result.id}:`, error)
          hasError = true
        }
      }
    }

    setIsSaving(false)

    if (!hasError) {
      setIsEditing(false)
      setEditedResults([])
      if (onUpdate) {
        onUpdate()
      }
    } else {
      alert('一部の更新に失敗しました。コンソールを確認してください。')
    }
  }

  const updateEditedResult = (
    index: number,
    field: keyof GameResult,
    value: any,
  ) => {
    const updated = [...editedResults]
    updated[index] = { ...updated[index], [field]: value }
    setEditedResults(updated)
  }

  const handlePlayerNameBlur = (index: number, value: string) => {
    // Convert to full-width
    const fullWidthName = toFullWidth(value)
    updateEditedResult(index, 'player_name', fullWidthName)
  }

  const displayResults = isEditing ? editedResults : results

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">ゲーム情報</h4>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            編集
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto touch-pan-x">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-left max-w-[10rem]">
                プレイヤー
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center min-w-[2.5rem]">
                P
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                K
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                D
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center min-w-[3rem]">
                As.
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Cn.
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center min-w-[3rem]">
                Cg.
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Fl.
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                勝敗
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                チーム
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                MVP
              </th>
            </tr>
          </thead>
          <tbody>
            {displayResults.map((result, index) => (
              <tr
                key={result.id}
                className={result.is_you ? 'bg-blue-50' : 'bg-white'}
              >
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {isEditing ? (
                    <>
                      <div>
                        <input
                          type="text"
                          value={result.player_name || ''}
                          onChange={(e) =>
                            updateEditedResult(
                              index,
                              'player_name',
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            handlePlayerNameBlur(index, e.target.value)
                          }
                          className="bg-transparent border-none p-0 text-xs focus:outline-none"
                        />
                        {result.player_name &&
                          players.length > 0 &&
                          !players.includes(result.player_name) && (
                            <span className="text-orange-500 text-[10px] block">
                              ⚠ 未登録プレイヤー
                            </span>
                          )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <span>{result.player_name || '-'}</span>
                      {result.player_name &&
                        players.length > 0 &&
                        !players.includes(result.player_name) && (
                          <span className="text-orange-500 text-[10px] block">
                            ⚠ 未登録プレイヤー
                          </span>
                        )}
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.score ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'score',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-right focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : result.score !== null ? (
                    result.score.toLocaleString()
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.kill ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'kill',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.kill ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.death ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'death',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.death ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.assist ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'assist',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.assist ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.chain ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'chain',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.chain ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.charge ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'charge',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.charge ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={result.flight ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'flight',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    (result.flight ?? '-')
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <select
                      value={result.is_win ?? ''}
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'is_win',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none appearance-none"
                      style={{
                        color:
                          result.is_win !== null
                            ? result.is_win === 1
                              ? 'rgb(251, 191, 36)'
                              : result.is_win === -1
                                ? 'rgb(76, 29, 149)'
                                : 'rgb(132, 204, 22)'
                            : 'inherit',
                        fontWeight: result.is_win === 1 ? 'bold' : 'normal',
                      }}
                    >
                      <option value="">-</option>
                      <option value="1">勝</option>
                      <option value="0">引</option>
                      <option value="-1">負</option>
                    </select>
                  ) : result.is_win !== null ? (
                    <span className={intToColorClass(result.is_win)}>
                      {intToGameResult(result.is_win)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <select
                      value={
                        result.team === null
                          ? ''
                          : result.team
                            ? 'true'
                            : 'false'
                      }
                      onChange={(e) =>
                        updateEditedResult(
                          index,
                          'team',
                          e.target.value === ''
                            ? null
                            : e.target.value === 'true',
                        )
                      }
                      className="w-full bg-transparent border-none p-0 text-xs text-center focus:outline-none appearance-none"
                    >
                      <option value="">-</option>
                      <option value="true">青</option>
                      <option value="false">赤</option>
                    </select>
                  ) : result.team !== null ? (
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${
                        result.team ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={result.is_mvp || false}
                      onChange={(e) =>
                        updateEditedResult(index, 'is_mvp', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  ) : result.is_mvp ? (
                    <span className="text-yellow-500 font-bold">★</span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
