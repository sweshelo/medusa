'use client'

import DOMPurify from 'dompurify'
import { useState, useTransition } from 'react'
import { agreeToTerms } from '../../app/terms/actions'

interface TermsContentProps {
  htmlContent: string
  redirectPath?: string
}

export default function TermsContent({
  htmlContent,
  redirectPath,
}: TermsContentProps) {
  const [agreed, setAgreed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAgree = () => {
    startTransition(async () => {
      await agreeToTerms(redirectPath || undefined)
    })
  }

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(htmlContent)

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <div
          className="prose prose-slate max-w-none max-h-96 overflow-y-auto rounded border border-gray-100 bg-gray-50 p-6"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown表示のためサニタイズ済みHTMLの描画を許容する
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>

      <div className="mb-4 flex items-start">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
          上記の利用規約に同意します
        </label>
      </div>

      <button
        type="button"
        onClick={handleAgree}
        disabled={!agreed || isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isPending ? '処理中...' : '同意して続ける'}
      </button>
    </div>
  )
}
