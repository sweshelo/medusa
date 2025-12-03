import { Headline } from '@/components/common/headline'
import { SignOut } from '@/components/signout'
import { LinkPlayer } from '@/features/link-player'
import { getLinkedPlayer } from './actions'

export default async function Page() {
  const { player } = await getLinkedPlayer()

  return (
    <div className="px-4">
      <Headline title="設定" />
      <div className="mb-8">
        <LinkPlayer initialPlayer={player} />
      </div>
      <SignOut />
    </div>
  )
}
