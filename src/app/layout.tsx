import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Header } from '@/components/header'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | 閻魔帳',
    default: '閻魔帳',
  },
  description: 'チェイスチェイスジョーカーズのプレイ履歴を分析します。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased font-mplus`}>
        <Header />
        <div className="w-full min-h-screen mx-auto bg-gray-100 sm:p-7">
          <div className="max-w-[700px] mx-auto bg-sky-50 p-4 sm:p-8 sm:rounded-lg shadow-2xl">
            {children}
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
