import { Headline } from '@/components/common/headline'
import { SignOut } from '@/components/signout'
import { LinkPlayer } from '@/features/link-player'
import { getLinkedPlayer } from './actions'

export default async function Page() {
  const { player } = await getLinkedPlayer()

  return (
    <>
      <Headline title="設定" />
      <LinkPlayer initialPlayer={player} />
      <SignOut />
    </>
  )
}
