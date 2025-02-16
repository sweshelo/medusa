import { Headline } from '@/components/common/headline'
import { SearchBox } from '@/components/search-box'

export default async function Page() {
  return (
    <>
      <div className="text-center h-lvh">
        <Headline title="プレーヤー検索" />
        <div className="w-full">
          <SearchBox />
        </div>
      </div>
    </>
  )
}
