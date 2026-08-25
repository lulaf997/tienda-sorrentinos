// Toda la configuración de la tienda vive acá, leída de variables de entorno
// (archivo .env en local, y "Environment Variables" en Vercel).
// Ver README.md para instrucciones completas de cada valor.

export const STORE_NAME = import.meta.env.VITE_STORE_NAME || "Sorrentinos Caceros";

export const STORE_TAGLINE =
  import.meta.env.VITE_STORE_TAGLINE || "Pedí online, retirá o coordiná el envío por WhatsApp";

// Número de WhatsApp SIN el "+", con código de país. Ej: Argentina 11 1234-5678 -> 5491112345678
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5491112345678";

// URL del Google Sheet de productos publicado como CSV (ver README).
export const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || "";

// URL del Google Apps Script (Web App) que registra cada pedido en la hoja "Pedidos".
export const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";
