'use client'

import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { Tooltip } from 'react-tooltip'

export const DeviationToolTipIcon = () => {
  return (
    <>
      <AiOutlineQuestionCircle data-tooltip-id="deviation" />
      <Tooltip id="deviation">
        <p>平均貢献Pから算出された偏差値です。</p>
        <p>背景色は次のように決定されます。</p>
        <ul>
          <li>虹: TOP</li>
          <li>金: 上位1%</li>
          <li>銀: 上位5%</li>
          <li>銅: 上位10%</li>
        </ul>
      </Tooltip>
    </>
  )
}
