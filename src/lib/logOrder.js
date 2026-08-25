import { APPS_SCRIPT_URL } from "../config"

// Registra el pedido en la pestaña "Pedidos" del Google Sheet, vía el Apps Script
// publicado como Web App (ver apps-script/Code.gs y el README para el deploy).
// Se dispara en segundo plano: si falla, el pedido igual se manda por WhatsApp,
// así nunca se le traba la compra al cliente por un problema de logging.
export async function logOrderToSheet({ items, customerName, total }) {
  if (!APPS_SCRIPT_URL) return

  const payload = {
    fecha: new Date().toISOString(),
    cliente: customerName || "(sin nombre)",
    productos: items.map((i) => `${i.cantidad}x ${i.nombre}`).join(" | "),
    total,
  }

  try {
    // mode: "no-cors" + Content-Type text/plain evita el preflight CORS,
    // que Apps Script no maneja bien. No podemos leer la respuesta, pero no la necesitamos.
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn("No se pudo registrar el pedido en el Sheet:", err)
  }
}
