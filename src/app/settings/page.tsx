import Link from 'next/link'
import { Headline } from '@/components/common/headline'
import { SignOut } from '@/components/signout'
import { LinkPlayer } from '@/features/link-player'

export default async function Page() {
  return (
    <>
      <Headline title="設定" />
      <LinkPlayer />
      <div className="bg-white rounded-lg p-2 mb-2 text-center">
        <Link className="underline text-red-500" href={'/reset-password'}>
          パスワードの変更
        </Link>
      </div>
      <SignOut />
    </>
  )
}
