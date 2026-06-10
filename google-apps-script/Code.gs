/**
 * HH Jewelry — Orders backend (Google Apps Script web app)
 * --------------------------------------------------------
 * Paste this into Extensions ▸ Apps Script in your Google Sheet,
 * set SECRET below to match your SHEET_SECRET env var, then deploy
 * as a Web App (see README for exact steps).
 *
 * Handles three actions from the website:
 *   POST { action: "create", ...order }     → append a row, returns the order
 *   POST { action: "updateStatus", id, status } → update one row's status
 *   GET  ?action=list                        → return all orders as JSON
 *
 * The sheet tab must be named "Orders". It is created automatically
 * with headers on first use.
 */

var SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING"; // must match SHEET_SECRET

var HEADERS = [
  "id", "createdAt", "customerName", "phone", "city", "address",
  "productName", "quantity", "color", "notes", "unitPrice", "total", "status",
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Orders");
  if (!sheet) {
    sheet = ss.insertSheet("Orders");
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function rowToOrder_(row) {
  var o = {};
  for (var i = 0; i < HEADERS.length; i++) o[HEADERS[i]] = row[i];
  // numeric coercions
  o.id = Number(o.id);
  o.quantity = Number(o.quantity);
  o.unitPrice = Number(o.unitPrice);
  o.total = Number(o.total);
  if (o.createdAt instanceof Date) o.createdAt = o.createdAt.toISOString();
  return o;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });

    var sheet = getSheet_();

    if (body.action === "create") {
      var id = sheet.getLastRow(); // header is row 1 → first order gets id 1
      var createdAt = new Date();
      var total = Number(body.total != null ? body.total : body.unitPrice * body.quantity);
      sheet.appendRow([
        id, createdAt, body.customerName, body.phone, body.city, body.address,
        body.productName, Number(body.quantity), body.color || "", body.notes || "",
        Number(body.unitPrice), total, "pending",
      ]);
      return json_({
        ok: true,
        order: {
          id: id,
          createdAt: createdAt.toISOString(),
          customerName: body.customerName,
          phone: body.phone,
          city: body.city,
          address: body.address,
          productName: body.productName,
          quantity: Number(body.quantity),
          color: body.color || "",
          notes: body.notes || "",
          unitPrice: Number(body.unitPrice),
          total: total,
          status: "pending",
        },
      });
    }

    if (body.action === "updateStatus") {
      var data = sheet.getDataRange().getValues();
      for (var r = 1; r < data.length; r++) {
        if (Number(data[r][0]) === Number(body.id)) {
          sheet.getRange(r + 1, HEADERS.indexOf("status") + 1).setValue(body.status);
          return json_({ ok: true });
        }
      }
      return json_({ ok: false, error: "order not found" });
    }

    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    if (e.parameter.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });
    if (e.parameter.action !== "list") return json_({ ok: false, error: "unknown action" });

    var sheet = getSheet_();
    var values = sheet.getDataRange().getValues();
    var orders = [];
    for (var r = 1; r < values.length; r++) {
      if (values[r][0] === "" || values[r][0] == null) continue;
      orders.push(rowToOrder_(values[r]));
    }
    return json_({ ok: true, orders: orders });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
