'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type VipContextValue = {
  isVIP: boolean
  toggleVIP: () => void
  setVIP: (value: boolean) => void
}

const VipContext = createContext<VipContextValue | undefined>(undefined)

export function VipProvider({ children }: { children: ReactNode }) {
  const [isVIP, setIsVIP] = useState(false)

  return (
    <VipContext.Provider
      value={{
        isVIP,
        toggleVIP: () => setIsVIP((prev) => !prev),
        setVIP: setIsVIP,
      }}
    >
      {children}
    </VipContext.Provider>
  )
}

export function useVIP() {
  const context = useContext(VipContext)
  if (!context) {
    throw new Error('useVIP must be used within a VipProvider')
  }
  return context
}
