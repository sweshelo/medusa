'use client'

import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import geoJson from '@/assets/japan.geo.json'

interface PrefectureMapProps {
  playedPrefectures: string[] // プレイ済み都道府県名の配列
}

export const PrefectureMap = ({ playedPrefectures }: PrefectureMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // 既存のSVGをクリア
    d3.select(mapContainerRef.current).selectAll('*').remove()

    const width = 400
    const height = 400
    const centerPos: [number, number] = [137.0, 38.2]
    const scale = 1000

    // 地図の投影設定
    const projection = d3
      .geoMercator()
      .center(centerPos)
      .translate([width / 2, height / 2])
      .scale(scale)

    // 地図をpathに投影(変換)
    const path = d3.geoPath().projection(projection)

    // SVG要素を追加
    const svg = d3
      .select(mapContainerRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')

    // 都道府県の領域データをpathで描画
    svg
      .selectAll('path')
      .data(geoJson.features)
      .enter()
      .append('path')
      // biome-ignore lint/suspicious/noExplicitAny: 型定義がないので許容
      .attr('d', path as any)
      .attr('stroke', '#666')
      .attr('stroke-width', 0.25)
      // biome-ignore lint/suspicious/noExplicitAny: 型定義がないので許容
      .attr('fill', (feature: any) => {
        // プレイ済みの都道府県は赤色、未プレイは灰色
        const prefectureName = feature.properties.name_ja
        return playedPrefectures.includes(prefectureName)
          ? '#CC4C39'
          : '#A0A0A0'
      })
      .attr('fill-opacity', 0.8)
  }, [playedPrefectures])

  return <div ref={mapContainerRef} className="w-full" />
}
