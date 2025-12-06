import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { R2_BUCKET_NAME, R2_PUBLIC_URL, r2Client } from '@/service/r2/client'
import { createClient } from '@/service/supabase/server'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(request: Request) {
  try {
    // 認証チェック
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // フォームデータの取得
    const formData = await request.formData()
    const file = formData.get('file') as File
    const imageId = formData.get('imageId') as string
    const takenAt = formData.get('takenAt') as string | null

    if (!file || !imageId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 },
      )
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed' },
        { status: 400 },
      )
    }

    // ファイルをBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // R2にアップロード
    const key = `images/${imageId}.jpg`
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    const imageUrl = `${R2_PUBLIC_URL}/${key}`

    // game_imageをデータベースに保存
    const { error: imageError } = await supabase.from('game_image').insert({
      id: imageId,
      user_id: user.id,
      url: imageUrl,
      taken_at: takenAt || null,
      processed: false,
    })

    if (imageError) {
      console.error('Failed to save image metadata:', imageError)
      return NextResponse.json(
        { error: 'Failed to save image metadata' },
        { status: 500 },
      )
    }

    // gameレコードも作成
    const { error: gameError } = await supabase.from('game').insert({
      image_id: imageId,
      played_at: takenAt || null,
      recorded_by: user.id,
    })

    if (gameError) {
      console.error('Failed to create game record:', gameError)
      // game_imageは既に作成済みだが、gameの作成に失敗
      // Workerが後で処理できるため、エラーは返さずに警告のみ
    }

    return NextResponse.json({
      success: true,
      imageId,
      url: imageUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
