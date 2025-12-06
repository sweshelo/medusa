import { Headline } from '@/components/common/headline'

export default function Page() {
  return (
    <>
      <Headline title="特定商取引法に基づく表記" />
      <div className="max-w-4xl mx-auto p-4 bg-white">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                責任者
              </th>
              <td className="p-4">
                Sweshelo
                <br />
                <span className="text-xs text-gray-600">
                  ※正当な法的請求の場合、遅滞なく開示いたします。
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                所在地
              </th>
              <td className="p-4">
                非公開
                <br />
                <span className="text-xs text-gray-600">
                  ※正当な法的請求の場合、遅滞なく開示いたします。
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                電話番号
              </th>
              <td className="p-4">
                非公開
                <br />
                <span className="text-xs text-gray-600">
                  ※正当な法的請求の場合、遅滞なく開示いたします。
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                メールアドレス
              </th>
              <td className="p-4">sweshelo@gmail.com</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                サービス内容
              </th>
              <td className="p-4">Webサービスの提供</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                販売価格
              </th>
              <td className="p-4">
                サービス利用は無料。運営補助として以下金額で提供される商品を購入可能。
                <br />
                ・100円
                <br />
                ・500円
                <br />
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                商品代金以外の必要料金
              </th>
              <td className="p-4">
                インターネット接続料金、通信料金等は利用者の負担とします。
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                支払方法
              </th>
              <td className="p-4">クレジットカード</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                支払時期
              </th>
              <td className="p-4">サービス購入時に決済</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                サービス提供時期
              </th>
              <td className="p-4">決済完了後、即時利用可能</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                返品・キャンセルについて
              </th>
              <td className="p-4">
                デジタルコンテンツの性質上、原則として返品・返金はお受けできません。
                <br />
                <span className="text-sm text-gray-600">
                  ※不具合等がある場合はお問い合わせください。
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4 bg-gray-100 w-1/3 align-top">
                動作環境
              </th>
              <td className="p-4">
                最新バージョンの主要ブラウザ（Chrome、Firefox、Safari、Edge）
                <br />
                ※推奨環境以外での動作は保証いたしかねます。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
