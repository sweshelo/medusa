import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { marked } from 'marked'
import { Headline } from '@/components/common/headline'
import TermsContent from '../../features/tos/terms-content'

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  // Read markdown file
  const filePath = join(
    process.cwd(),
    'public',
    'docs',
    'terms',
    'term-of-use.md',
  )
  const markdown = await readFile(filePath, 'utf-8')

  // Convert markdown to HTML
  const htmlContent = await marked(markdown)

  const params = await searchParams
  const redirectPath = params.redirect

  return (
    <>
      <Headline title="利用規約" />
      <TermsContent htmlContent={htmlContent} redirectPath={redirectPath} />
    </>
  )
}
