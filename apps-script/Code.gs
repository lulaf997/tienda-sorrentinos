// Este código va en el Editor de Apps Script del Google Sheet (Extensiones > Apps Script).
// Ver README.md para el paso a paso completo de instalación y deploy.
//
// Qué hace: cada vez que alguien confirma un pedido en la web, este script
// agrega una fila en la pestaña "Pedidos" con fecha, cliente, productos y total.

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Pedidos");

    // Si la pestaña "Pedidos" no existe todavía, la crea con encabezados.
    if (!sheet) {
      sheet = ss.insertSheet("Pedidos");
      sheet.appendRow(["Fecha", "Cliente", "Productos", "Total"]);
    }

    sheet.appendRow([
      data.fecha || new Date().toISOString(),
      data.cliente || "",
      data.productos || "",
      data.total || 0,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
