'use client'

import classNames from 'classnames'
import { addSeconds, differenceInSeconds, format } from 'date-fns'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'

import { revalidatePage } from './action'

interface RevalidateLog {
  [key: string]: {
    timestamp: string
  }
}

const getRevalidateLog = (): RevalidateLog => {
  return JSON.parse(localStorage.getItem('revalidate') ?? '{}')
}

const RefreshSpan = 300

export const Revalidater = () => {
  const pathname = usePathname()
  const router = useRouter()
  const handleButtonClick = useCallback(async () => {
    await revalidatePage(pathname)
    toast.success('データベースへの問い合わせをリクエストしました')
    localStorage.setItem(
      'revalidate',
      JSON.stringify({
        ...getRevalidateLog(),
        [pathname]: {
          timestamp: new Date().toISOString(),
        },
      })
    )
    setEnabled(false)
    setStoredDate(new Date())
    router.refresh()
  }, [pathname, router])

  const [isEnabled, setEnabled] = useState<boolean>(false)
  const [storedDate, setStoredDate] = useState<Date | null>(null)
  useEffect(() => {
    setEnabled(storedDate ? differenceInSeconds(new Date(), storedDate) >= RefreshSpan : true)
  }, [pathname, storedDate])

  useEffect(() => {
    const timestamp = getRevalidateLog()[pathname]?.timestamp
    if (timestamp) setStoredDate(new Date(timestamp))
  }, [pathname])

  return (
    <>
      <div
        className={classNames('p-[3px] rounded-lg shadow mt-4 outline outline-1', {
          'bg-green-300': isEnabled,
          'outline-green-500': isEnabled,
          'text-black': isEnabled,
          'bg-gray-300': !isEnabled,
          'outline-gray-400': !isEnabled,
          'text-gray-500': !isEnabled,
        })}
        data-tooltip-id={'revalidate'}
      >
        <button className="w-full text-center" onClick={handleButtonClick} disabled={!isEnabled}>
          最新のデータをリクエストする
        </button>
      </div>
      {!isEnabled ? (
        <Tooltip id="revalidate">
          <p>
            このページは
            {format(storedDate ? addSeconds(storedDate, RefreshSpan) : new Date(), 'HH時mm分ss秒')}
            に再度更新が可能です。
          </p>
        </Tooltip>
      ) : (
        <Tooltip id="revalidate">
          <p>
            データベースへ最新のデータを問い合わせます
            <br />
            このボタンを押さずとも 1日1回は更新されます
          </p>
        </Tooltip>
      )}
    </>
  )
}
