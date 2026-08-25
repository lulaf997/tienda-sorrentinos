# La Vidriera — tienda con carrito → WhatsApp + Google Sheets

Página web con catálogo de productos, carrito de compras, y un botón que arma el
pedido y lo manda por WhatsApp. El catálogo se edita desde un Google Sheet (no hace
falta tocar código), y cada pedido queda registrado automáticamente en otra pestaña
del mismo Sheet.

No usa backend propio ni VPS: es 100% estática, se sirve gratis en Vercel.

---

## Cómo funciona

```
Google Sheet "Productos"  →  la web lee el catálogo (publicado como CSV)
        Cliente arma el carrito y toca "Enviar pedido"
                      ↓                              ↓
        Se abre WhatsApp con el pedido        Google Apps Script anota
        armado, listo para enviarte           el pedido en la pestaña
                                               "Pedidos" del mismo Sheet
```

---

## Paso 1 — Crear el Google Sheet de productos

1. Andá a [sheets.google.com](https://sheets.google.com) y creá una hoja nueva.
2. Nombrá la primera pestaña **`Productos`** (exactamente así) y cargá estas columnas
   en la fila 1:

   | id | nombre | precio | imagen | descripcion | categoria | activo |
   |----|--------|--------|--------|-------------|-----------|--------|

   - **precio**: solo números, sin puntos ni `$` (ej: `15900`)
   - **imagen**: un link directo a una foto (podés subir la foto a Google Drive,
     "Compartir → Cualquiera con el link", y usar ese link, o usar cualquier imagen
     pública)
   - **activo**: `SI` o `NO` — poné `NO` para ocultar un producto sin borrarlo

3. Cargá tus productos, una fila por producto.

4. Publicá la hoja como CSV:
   - `Archivo` → `Compartir` → `Publicar en la Web`
   - En "Vincular", elegí la pestaña **`Productos`** (no "Todo el documento")
   - En el segundo desplegable elegí **Valores separados por comas (.csv)**
   - Tocá **Publicar** y confirmá
   - Copiá la URL que te da (algo como `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`)
   - Esa URL va en `VITE_SHEET_CSV_URL` (Paso 3)

> Cualquier cambio que hagas en la hoja `Productos` se refleja en la web la próxima
> vez que alguien la carga (no hace falta redeployar nada).

---

## Paso 2 — Registrar pedidos automáticamente (Google Apps Script)

En el **mismo Google Sheet**:

1. `Extensiones` → `Apps Script`
2. Borrá el código de ejemplo que aparece y pegá el contenido del archivo
   [`apps-script/Code.gs`](./apps-script/Code.gs) de esta carpeta.
3. Guardá (ícono de disquete).
4. Arriba a la derecha, `Implementar` → `Nueva implementación`.
5. Click en el engranaje ⚙️ junto a "Seleccionar tipo" → elegí **Aplicación web**.
6. Configurá:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
7. Click en `Implementar`. Google te va a pedir autorizar permisos la primera vez
   (es tu propio script, es seguro aceptar).
8. Copiá la **URL de la aplicación web** que te da (termina en `/exec`).
   Esa URL va en `VITE_APPS_SCRIPT_URL` (Paso 3).

La primera vez que llegue un pedido, el script crea solo la pestaña **`Pedidos`**
con las columnas Fecha / Cliente / Productos / Total. Ahí vas a ir viendo el conteo
de pedidos y clientes.

> Si más adelante editás el código del script, tenés que hacer
> `Implementar` → `Gestionar implementaciones` → ícono de lápiz → **Nueva versión**
> para que el cambio se aplique a la URL ya publicada.

---

## Paso 3 — Configurar la web

En la carpeta del proyecto, copiá `.env.example` a `.env`:

```powershell
copy .env.example .env
```

Abrí `.env` con el Bloc de notas y completá tus datos:

```
VITE_STORE_NAME="Nombre de tu tienda"
VITE_WHATSAPP_NUMBER=5491112345678
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

- `VITE_WHATSAPP_NUMBER`: tu número con código de país, sin el `+` ni espacios ni
  guiones. Ejemplo Argentina, celular 11 1234-5678 → `5491112345678`
- Mientras `VITE_SHEET_CSV_URL` esté vacío, la web muestra productos de ejemplo
  para que puedas probar el diseño.

---

## Paso 4 — Probar en tu computadora

Necesitás [Node.js](https://nodejs.org) instalado (versión 18 o más nueva).

```powershell
npm install
npm run dev
```

Te va a dar un link tipo `http://localhost:5173` — abrilo en el navegador. Cada vez
que guardás un cambio, la página se actualiza sola.

---

## Paso 5 — Deploy en Vercel (gratis, sin GitHub)

No hace falta GitHub: se sube directo desde tu PC con la terminal de Vercel.

1. Instalá la herramienta de Vercel (una sola vez):

   ```powershell
   npm install -g vercel
   ```

2. Iniciá sesión (te abre el navegador para crear cuenta gratis o loguearte):

   ```powershell
   vercel login
   ```

3. Parado en la carpeta del proyecto, ejecutá:

   ```powershell
   vercel
   ```

   Te va a hacer preguntas — para todas podés apretar Enter para aceptar el valor
   por defecto (Vercel detecta solo que es un proyecto Vite).

4. Cuando te pregunte por las variables de entorno, o después desde el panel web
   ([vercel.com](https://vercel.com) → tu proyecto → **Settings → Environment
   Variables**), cargá las mismas 4 variables que pusiste en tu `.env`:
   `VITE_STORE_NAME`, `VITE_WHATSAPP_NUMBER`, `VITE_SHEET_CSV_URL`,
   `VITE_APPS_SCRIPT_URL`.

5. Deploy a producción (con link fijo, no de prueba):

   ```powershell
   vercel --prod
   ```

Te va a dar un link final tipo `https://tu-tienda.vercel.app` — ese es el que
compartís con tus clientes.

> Cada vez que quieras subir un cambio de diseño/código, volvé a correr
> `vercel --prod` desde la carpeta del proyecto. Los cambios de **productos** no
> necesitan esto — esos se editan directo en el Google Sheet.

---

## Editar productos de acá en más

Solo editá la hoja `Productos` del Google Sheet: agregar fila = nuevo producto,
cambiar `precio` = cambia el precio, poner `NO` en `activo` = lo oculta. No hace
falta volver a hacer deploy.

## Ver pedidos y clientes

Se van acumulando en la pestaña `Pedidos` del mismo Google Sheet: fecha, nombre de
cliente, detalle del pedido y total. Desde ahí podés armar cualquier conteo con
tablas dinámicas de Sheets si más adelante querés estadísticas.

## Estructura del proyecto

```
src/
  config.js          → lee las variables de entorno (.env)
  lib/sheets.js       → trae los productos del Google Sheet
  lib/whatsapp.js      → arma el mensaje y el link de WhatsApp
  lib/logOrder.js      → manda el pedido al Apps Script
  context/CartContext.jsx → estado del carrito
  components/          → Header, grilla de productos, panel del carrito
apps-script/Code.gs     → código a pegar en Google Apps Script
```

## Problemas comunes

- **"Mostrando productos de ejemplo" no desaparece:** revisá que
  `VITE_SHEET_CSV_URL` esté bien pegada en `.env` (y en Vercel), y que hayas
  publicado la pestaña `Productos` (no todo el documento) como CSV.
- **El pedido se manda por WhatsApp pero no aparece en "Pedidos":** revisá que
  `VITE_APPS_SCRIPT_URL` termine en `/exec`, y que al implementar el script hayas
  puesto acceso "Cualquier usuario".
- **Cambié el código del Apps Script y no pasa nada:** te falta crear una
  **Nueva versión** de la implementación (ver nota al final del Paso 2).
