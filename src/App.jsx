import { useEffect, useState } from "react"
import Header from "./components/Header"
import ProductGrid from "./components/ProductGrid"
import CartPanel from "./components/CartPanel"
import { fetchProducts } from "./lib/sheets"

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingExample, setUsingExample] = useState(false)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then(({ products, usingExample }) => {
        if (!active) return
        setProducts(products)
        setUsingExample(usingExample)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        usingExample={usingExample}
      />
      <CartPanel />
      <footer className="mx-auto max-w-6xl px-5 pb-10 text-center font-mono text-xs text-[var(--ink)]/40 md:px-8">
        Hecho con React + Vite · Pedidos por WhatsApp
      </footer>
    </div>
  )
}
