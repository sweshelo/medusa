import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const name = decodeURI((await params).name)

  return {
    title: `${name}さんのページ`,
    description: `${name}さんの記録を閲覧します`,
  }
}

export default async function Page({ params }: PageProps) {
  const { name } = await params
  return (
    <>
      <p>{decodeURI(name)}さんのページ</p>
    </>
  )
}
