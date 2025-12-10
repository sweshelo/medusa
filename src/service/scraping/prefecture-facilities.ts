import { cacheLife } from 'next/cache'

/**
 * 都道府県情報の型定義
 */
interface PrefectureInfo {
  area_id: string
  id: string
  name: string
  exist: string
}

/**
 * 施設API レスポンスの型定義
 */
interface FacilityApiResponse {
  arealist: {
    status: string
    areaid: string
    areaname: string
    modelname: string
    modelpaseli: string
    areainfo: Array<{
      id: string
      name: string
      exist: string
    }>
  }
  preflist: {
    status: string
    areaid: string
    areaname: string
    prefid: string
    prefname: string
    modelname: string
    modelpaseli: string
    prefinfo: PrefectureInfo[]
  }
}

/**
 * 稼働中の都道府県リストを取得
 */
export const fetchActivePrefectures = async (): Promise<string[]> => {
  'use cache'
  cacheLife('weeks')

  try {
    const response = await fetch(
      'https://p.eagate.573.jp/game/facility/search/json/facilityarealist.html?gkey=CCJ&paselif=false',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      },
    )

    if (!response.ok) {
      console.error('施設APIの取得に失敗:', response.status)
      return []
    }

    const data: FacilityApiResponse = await response.json()

    // preflist.prefinfo から exist が "true" の都道府県名を抽出
    const prefectures = data.preflist.prefinfo
      .filter((pref) => pref.exist === 'true')
      .map((pref) => pref.name)

    console.info(`稼働中の都道府県を取得: ${prefectures.length}件`)
    return prefectures
  } catch (error) {
    console.error('稼働中の都道府県取得でエラー:', error)
    return []
  }
}
