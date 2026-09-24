/* ============================================================
   PENGATURAN TOKO DINAMIS
   Status buka/tutup, jam, stok habis, harga, dan pengumuman
   diatur dari tab "Toko" di aplikasi kasir, disimpan di Google Sheets.
   File ini dipakai bersama oleh index.html dan kasir.html.
   ============================================================ */
const TOKO_DEFAULT = { status: "otomatis", pesanTutup: "", jamBuka: KEDAI.jamBuka, jamTutup: KEDAI.jamTutup, habis: [], harga: {}, hargaTp: {}, pengumuman: "" };
const HARGA_ASLI = {}; MENU.forEach(k => k.items.forEach(i => HARGA_ASLI[i.id] = i.harga));
const HARGA_TP_ASLI = {}; TOPPING.forEach(t => HARGA_TP_ASLI[t.nama] = t.harga);
let TOKO = { ...TOKO_DEFAULT };

function terapkanToko(s) {
  TOKO = { ...TOKO_DEFAULT, ...(s || {}) };
  KEDAI.jamBuka = +TOKO.jamBuka; KEDAI.jamTutup = +TOKO.jamTutup;
  MENU.forEach(k => k.items.forEach(i => {
    const h = TOKO.harga[i.id];
    i.harga = (h === undefined || h === "" || isNaN(+h)) ? HARGA_ASLI[i.id] : +h;
    i.habis = TOKO.habis.includes(i.id);
  }));
  TOPPING.forEach(t => {
    const h = TOKO.hargaTp[t.nama];
    t.harga = (h === undefined || h === "" || isNaN(+h)) ? HARGA_TP_ASLI[t.nama] : +h;
    t.habis = TOKO.habis.includes("tp:" + t.nama);
  });
}
try { terapkanToko(JSON.parse(localStorage.getItem("toko-set") || "null")); } catch (e) { terapkanToko(null); }

// Ambil pengaturan terbaru. Mengembalikan true kalau ada perubahan.
async function ambilToko(url) {
  url = url || KEDAI.api;
  if (!url) return false;
  try {
    const r = await fetch(url + "?aksi=toko&_=" + Date.now() + Math.random().toString(36).slice(2,6), {cache: "no-store"});
    const j = await r.json();
    if (!j.ok) return false;
    const baru = JSON.stringify(j.toko || {});
    if (baru === localStorage.getItem("toko-set")) return false;
    localStorage.setItem("toko-set", baru);
    terapkanToko(j.toko);
    return true;
  } catch (e) { return false; }
}
