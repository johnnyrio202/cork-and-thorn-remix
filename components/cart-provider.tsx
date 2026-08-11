'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export type CartLine = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  addItem: (item: Omit<CartLine, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)

  const addItem = useCallback((item: Omit<CartLine, 'quantity'>) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id)
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const count = lines.reduce((sum, l) => sum + l.quantity, 0)
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
