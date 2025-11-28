import { ReactNode } from 'react'

interface LoadingProps {
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ children, size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] gap-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-sky-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      {children && <div className="text-gray-600 text-lg">{children}</div>}
      {!children && <p className="text-gray-600 text-lg">読み込み中...</p>}
    </div>
  )
}
