'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type DrawerContextType = {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}
