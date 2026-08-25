import { WHATSAPP_NUMBER } from "../config"

export function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

// Arma el texto del pedido con formato "ticket" y devuelve el link de WhatsApp.
export function buildWhatsAppOrderLink(items, customerName) {
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const lineas = items.map((item) => {
    const subtotal = formatPrice(item.precio * item.cantidad)
    return `• ${item.cantidad}x ${item.nombre} — ${subtotal}`
  })

  const partes = [
    "🧾 *Nuevo pedido*",
    customerName ? `Cliente: ${customerName}` : null,
    "",
    ...lineas,
    "",
    `*Total: ${formatPrice(total)}*`,
  ].filter((line) => line !== null)

  const mensaje = partes.join("\n")
  const encoded = encodeURIComponent(mensaje)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}
