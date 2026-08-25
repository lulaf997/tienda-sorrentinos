import { createContext, useContext, useMemo, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { id, nombre, precio, imagen, cantidad }
  const [isOpen, setIsOpen] = useState(false)

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
    setIsOpen(true)
  }

  function updateQuantity(id, cantidad) {
    if (cantidad <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)))
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    [items]
  )
  const count = useMemo(() => items.reduce((sum, i) => sum + i.cantidad, 0), [items])

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    count,
    isOpen,
    setIsOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
