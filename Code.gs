/* ============================================================
   KASIR AMEERA — penyimpanan data di Google Sheets
   Tempel seluruh kode ini di Extensions > Apps Script
   ============================================================ */

// ====== GANTI PIN INI (angka/huruf rahasia, minimal 4 digit) ======
const PIN = "1234";
// ==================================================================

const KOLOM = ["id","ts","waktu","nama","sumber","metode","bayar","items","subtotal","ongkir","total","diterima","status","catatan","perangkat"];

function lembar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("Pesanan");
  if (!sh) {
    sh = ss.insertSheet("Pesanan");
    sh.appendRow(KOLOM);
    sh.setFrozenRows(1);
  }
  return sh;
}

function jawab(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Ambil daftar pesanan (sejak waktu tertentu)
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.pin !== PIN) return jawab({ ok: false, error: "PIN salah" });
  const dari = Number(p.dari || 0);
  const data = lembar().getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (!r[0] || Number(r[1]) < dari) continue;
    const o = {};
    KOLOM.forEach((k, j) => o[k] = r[j]);
    try { o.items = JSON.parse(o.items); } catch (err) { o.items = []; }
    o.waktu = String(o.waktu);
    rows.push(o);
  }
  return jawab({ ok: true, rows: rows });
}

// Simpan pesanan baru / ubah status (batal)
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return jawab({ ok: false, error: "Data rusak" }); }
  if (body.pin !== PIN) return jawab({ ok: false, error: "PIN salah" });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = lembar();
    const ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues().map(r => String(r[0]));

    if (body.aksi === "tambah") {
      const tersimpan = [];
      (body.data || []).forEach(o => {
        if (ids.indexOf(String(o.id)) === -1) {
          sh.appendRow(KOLOM.map(k => k === "items" ? JSON.stringify(o.items || []) : (o[k] === undefined ? "" : o[k])));
          ids.push(String(o.id));
        }
        tersimpan.push(o.id);
      });
      return jawab({ ok: true, tersimpan: tersimpan });
    }

    if (body.aksi === "status") {
      const hasil = [];
      (body.data || []).forEach(s => {
        const baris = ids.indexOf(String(s.id));
        if (baris > 0) sh.getRange(baris + 1, KOLOM.indexOf("status") + 1).setValue(s.status);
        hasil.push(s.id);
      });
      return jawab({ ok: true, diubah: hasil });
    }

    return jawab({ ok: false, error: "Aksi tidak dikenal" });
  } finally {
    lock.releaseLock();
  }
}
