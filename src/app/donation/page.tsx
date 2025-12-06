import type { Metadata } from 'next'

import { Headline } from '@/components/common/headline'

export const metadata: Metadata = {
  title: '御布施',
}

export default async function Page() {
  return (
    <div className="text-center py-2 mb-2">
      <Headline title="御布施" />

      <div className="bg-white rounded-lg container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <div>
            <p className="text-sm text-gray-600">
              閻魔帳に寄付をすることで、運営を支援することができます。
            </p>
            <p className="text-sm text-gray-600 m-1">
              決済は外部ページで行われ、閻魔帳には決済情報は保存されません。
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="p-3 text-sm text-gray-600">
              100円の御布施を1年間継続して納入(1200円)頂くことで、
              閻魔帳の累積赤字の 約3%
              が解消されます。また、100円でランニングコストの 約6%
              を補うことができます。
              <br />
              <span className="text-[10px] text-gray-400">
                (具体的な金額は為替レートや使用状況により変動します)
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              以下の外部サービスで決済を行えます
              <br />
              アイコンをクリックして遷移します
            </p>
            {/* Fanbox Card */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white shadow-sm">
              <a
                href="https://sweshelo.fanbox.cc/"
                target="_blank"
                className="inline-block hover:opacity-80 transition-opacity"
                rel="noopener"
              >
                <img
                  src={
                    'https://s.pximg.net/www/js/fanbox/8068a01f50b06fc3cde7c98141bfa428.svg'
                  }
                  alt="Support on PIXIV FANBOX"
                  className="h-auto w-40"
                />
              </a>
              <p className="text-xs text-gray-600 mt-3">
                FANBOXでは、100円、500円、1500円のメンバーシップを用意しています。
                <br />
                Pixivアカウントが必要です。
              </p>
            </div>
            {/* Ko-fi Card */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white shadow-sm">
              <a
                href="https://ko-fi.com/P5P81PRZH1"
                target="_blank"
                className="inline-block hover:opacity-80 transition-opacity"
                rel="noopener"
              >
                <img
                  src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
                  alt="Buy Me a Coffee at ko-fi.com"
                  className="h-12 w-auto"
                />
              </a>
              <div className="mt-3">
                <p className="text-[12px] text-gray-400 mb-1">(英語のみ)</p>
                <p className="text-xs text-gray-600">
                  ko-fi.com では、100円、500円を選択肢として用意しています。
                  <br />
                  更に任意の金額を上乗せして寄付頂くことが可能です。
                  <br />
                  PayPalアカウントが必要です。
                </p>
              </div>
            </div>

            {/* Patreon Card */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white shadow-sm">
              <a
                href="https://patreon.com/sweshelo?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
                target="_blank"
                className="inline-block hover:opacity-80 transition-opacity"
                rel="noopener"
              >
                <img
                  src={'/image/patreon.png'}
                  alt="Support on Patreon"
                  className="h-auto w-40"
                />
              </a>
              <p className="text-xs text-gray-600 mt-3">
                Patreonでは、$3、$5、$10のメンバーシップを用意しています。
                <br />
                決済金額は引き落とし時の為替の影響を受けます。
                <br />
                Patreonアカウントが必要です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
