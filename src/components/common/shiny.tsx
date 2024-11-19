import classNames from 'classnames'
import { HTMLAttributes } from 'react'

import styles from '@/styles/shiny.module.scss'

interface ShinyProps {
  className?: HTMLAttributes<HTMLDivElement>['className']
  children?: React.ReactNode
  color: string
}

export const Shiny = ({ className, children, color }: ShinyProps) => {
  return <div className={classNames(className, styles[color])}>{children}</div>
}
