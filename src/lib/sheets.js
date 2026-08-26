import Papa from "papaparse"
import { SHEET_CSV_URL } from "../config"
import { exampleProducts } from "./exampleProducts"

// Columnas esperadas en la hoja "Productos" del Google Sheet:
// id | nombre | precio | imagen | descripcion | categoria | activo | stock
//
// - "precio" en números, sin puntos ni el símbolo $ (ej: 15900)
// - "activo" con SI / NO (si está vacío, se muestra igual). "NO" oculta el producto de la tienda.
// - "stock" con SI / NO (si está vacío, se asume que hay stock). "NO" muestra el producto
//   pero con la etiqueta "Sin stock" y sin poder agregarlo al carrito.
function normalizeRow(row, index) {
  const activo = String(row.activo ?? "SI").trim().toUpperCase()
  const stock = String(row.stock ?? "SI").trim().toUpperCase()
  return {
    id: String(row.id ?? index),
    nombre: String(row.nombre ?? "").trim(),
    precio: Number(String(row.precio ?? "0").replace(/[^\d.-]/g, "")) || 0,
    imagen: String(row.imagen ?? "").trim(),
    descripcion: String(row.descripcion ?? "").trim(),
    categoria: String(row.categoria ?? "").trim(),
    activo: activo !== "NO",
    enStock: stock !== "NO",
  }
}

export async function fetchProducts() {
  if (!SHEET_CSV_URL) {
    // Todavía no se conectó un Google Sheet: se muestran productos de ejemplo.
    return { products: exampleProducts, usingExample: true }
  }

  const response = await fetch(SHEET_CSV_URL)
  if (!response.ok) {
    throw new Error(`No se pudo leer el Google Sheet (status ${response.status})`)
  }
  const csvText = await response.text()

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const products = parsed.data
    .map(normalizeRow)
    .filter((p) => p.nombre && p.activo)

  return { products, usingExample: false }
}
