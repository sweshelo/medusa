'use client'

import { revalidateUserData } from './action'

interface Props {
  player: string
}

export const Revalidater = ({ player }: Props) => {
  return (
    <div className="p-[3px] rounded-lg bg-green-300 shadow mt-4 outline outline-1 outline-green-500">
      <button className="w-full text-center" onClick={() => revalidateUserData(player)}>
        最新の状態に更新する
      </button>
    </div>
  )
}
