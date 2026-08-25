import { useState } from "react"
import { useCart } from "../context/CartContext"
import { formatPrice, buildWhatsAppOrderLink } from "../lib/whatsapp"
import { logOrderToSheet } from "../lib/logOrder"

export default function CartPanel() {
  const { items, updateQuantity, removeItem, clearCart, total, isOpen, setIsOpen } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [sending, setSending] = useState(false)

  async function handleCheckout() {
    if (items.length === 0 || sending) return
    setSending(true)

    const link = buildWhatsAppOrderLink(items, customerName)

    // Se registra en el Sheet en paralelo, sin bloquear el envío por WhatsApp.
    logOrderToSheet({ items, customerName, total })

    window.open(link, "_blank", "noopener,noreferrer")

    setSending(false)
    clearCart()
    setCustomerName("")
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <button
          aria-label="Cerrar carrito"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[var(--ink)]/40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[var(--paper-light)] shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-hidden={!isOpen}
      >
        <div className="awning-stripes h-2 w-full shrink-0" aria-hidden="true" />

        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-display text-3xl tracking-wide">Tu pedido</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            className="stamp-btn flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--ink)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 font-mono text-sm">
          {items.length === 0 ? (
            <p className="py-10 text-center text-[var(--ink)]/50">
              Todavía no agregaste productos.
            </p>
          ) : (
            <ul className="divide-y divide-dashed divide-[var(--line)]">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--paper)]">
                    {item.imagen && (
                      <img src={item.imagen} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body font-medium text-[var(--ink)]">
                      {item.nombre}
                    </p>
                    <p className="text-[var(--ink)]/60">{formatPrice(item.precio)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--ink)]/40"
                        aria-label={`Restar uno a ${item.nombre}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--ink)]/40"
                        aria-label={`Sumar uno a ${item.nombre}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-[var(--stamp)] underline"
                      >
                        quitar
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-medium">
                    {formatPrice(item.precio * item.cantidad)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 bg-[var(--paper-light)]">
            <div className="receipt-edge" aria-hidden="true" />
            <div className="border-t-2 border-dashed border-[var(--line)] px-5 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between font-mono text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-[var(--ink)]/60">
                Tu nombre (opcional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Lucía"
                className="mb-4 w-full rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 py-2 font-body text-sm outline-none focus-visible:border-[var(--awning)]"
              />

              <button
                onClick={handleCheckout}
                disabled={sending}
                className="stamp-btn w-full rounded-sm border-2 border-[var(--ink)] bg-[var(--stamp)] py-3 font-display text-xl tracking-wide text-[var(--paper-light)] shadow-[3px_3px_0_var(--ink)] hover:bg-[var(--stamp-dark)] disabled:opacity-60"
              >
                Enviar pedido por WhatsApp
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
