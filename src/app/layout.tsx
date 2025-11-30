import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'

import { Loading } from '@/components/common/loading'
import { Drawer } from '@/components/drawer'
import { Header } from '@/components/header'
import { DrawerProvider } from '@/hooks/drawer'

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://放課後天地創造.club'),
  title: {
    template: '%s | 閻魔帳',
    default: '閻魔帳',
  },
  description: 'チェイスチェイスジョーカーズのプレイ履歴を分析します。',
  openGraph: {
    title: '閻魔帳',
    description: 'チェイスチェイスジョーカーズのプレイ履歴を分析します。',
    url: 'https://放課後天地創造.club',
    images: '/image/banner.png',
  },
  twitter: {
    title: '閻魔帳',
    description: 'チェイスチェイスジョーカーズのプレイ履歴を分析します。',
    site: '@sweshelo',
    images: '/image/banner.png',
  },
  icons: '/image/icon.png',
  keywords: [
    'CCJ',
    'チェイス',
    'チェイスチェイス',
    'チェイスチェイスジョーカーズ',
    '閻魔帳',
    '閻魔',
    'プレイ履歴',
    '履歴',
    '分析',
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Manifestの設定 */}
        <link rel="manifest" href="/manifest.json" />
        {/* iOS用のapple-touch-icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/image/icon-180.png"
        />
        {/* ブラウザのテーマカラー */}
        <meta name="theme-color" content="#7f1d1d" />
      </head>
      <body className={`antialiased font-mplus`}>
        <DrawerProvider>
          <Header />
          <Drawer />
          <div className="w-full min-h-screen mx-auto bg-gray-100 sm:p-7">
            <div className="max-w-[700px] mx-auto bg-sky-50 p-4 sm:p-8 sm:rounded-lg shadow-2xl min-h-lvh">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
          </div>
          <Analytics />
          <SpeedInsights />
          <ToastContainer />
        </DrawerProvider>
      </body>
    </html>
  )
}
