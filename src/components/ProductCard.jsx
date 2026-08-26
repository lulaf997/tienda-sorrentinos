import { formatPrice } from "../lib/whatsapp"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <article className="paper-card group relative flex flex-col overflow-hidden rounded-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--line)]/30">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-[var(--ink)]/30">
            {product.nombre}
          </div>
        )}

        <span className="stamp-btn absolute right-3 top-3 -rotate-6 rounded-full border-2 border-[var(--stamp)] bg-[var(--paper-light)] px-3 py-1 font-mono text-sm font-semibold text-[var(--stamp)] shadow-[2px_2px_0_var(--stamp)]">
          {formatPrice(product.precio)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.categoria && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--awning)]">
            {product.categoria}
          </span>
        )}
        <h3 className="font-display text-2xl leading-none text-[var(--ink)]">
          {product.nombre}
        </h3>
        {product.descripcion && (
          <p className="mt-1 flex-1 text-sm text-[var(--ink)]/70">{product.descripcion}</p>
        )}

        <button
          onClick={() => addItem(product)}
          className="stamp-btn mt-4 w-full rounded-sm border-2 border-[var(--ink)] bg-[var(--awning)] py-2 font-display text-lg tracking-wide text-[var(--paper-light)] shadow-[3px_3px_0_var(--ink)] hover:bg-[var(--awning-dark)]"
        >
          Agregar
        </button>
      </div>
    </article>
  )
}
