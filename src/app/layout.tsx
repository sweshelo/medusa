import { Header } from '@/components/header'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '閻魔帳',
  description: 'チェイスチェイスジョーカーズのプレイ履歴を分析します。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        <div className="w-full mx-auto bg-cyan-50 p-7">{children}</div>
      </body>
    </html>
  )
}
