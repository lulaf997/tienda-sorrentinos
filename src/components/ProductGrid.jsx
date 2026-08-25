import ProductCard from "./ProductCard"

export default function ProductGrid({ products, loading, error, usingExample }) {
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center font-mono text-sm text-[var(--ink)]/60 md:px-8">
        Cargando productos…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="paper-card rounded-sm border-[var(--stamp)] p-6 text-[var(--stamp)]">
          <p className="font-display text-xl">No se pudo cargar el catálogo</p>
          <p className="mt-1 font-mono text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center font-mono text-sm text-[var(--ink)]/60 md:px-8">
        Todavía no hay productos cargados en la hoja "Productos" del Google Sheet.
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
      {usingExample && (
        <p className="mb-6 rounded-sm border border-dashed border-[var(--mustard)] bg-[var(--mustard)]/10 px-4 py-2 font-mono text-xs text-[var(--ink)]/80">
          Mostrando productos de ejemplo — conectá tu Google Sheet en <code>.env</code> (VITE_SHEET_CSV_URL) para reemplazarlos.
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
