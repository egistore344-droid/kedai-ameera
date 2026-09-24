/* ============================================================
   PENGATURAN TOKO DINAMIS
   Status buka/tutup, jam, stok habis, harga, dan pengumuman
   diatur dari tab "Toko" di aplikasi kasir, disimpan di Google Sheets.
   File ini dipakai bersama oleh index.html dan kasir.html.
   ============================================================ */
const TOKO_DEFAULT = { status: "otomatis", pesanTutup: "", jamBuka: KEDAI.jamBuka, jamTutup: KEDAI.jamTutup, habis: [], harga: {}, hargaTp: {}, pengumuman: "", menuBaru: [] };
const HARGA_ASLI = {}; MENU.forEach(k => k.items.forEach(i => HARGA_ASLI[i.id] = i.harga));
const HARGA_TP_ASLI = {}; TOPPING.forEach(t => HARGA_TP_ASLI[t.nama] = t.harga);
let TOKO = { ...TOKO_DEFAULT };

function terapkanToko(s) {
  TOKO = { ...TOKO_DEFAULT, ...(s || {}) };
  KEDAI.jamBuka = +TOKO.jamBuka; KEDAI.jamTutup = +TOKO.jamTutup;
  // Menu tambahan (dibuat dari tab Toko di kasir)
  MENU.forEach(k => { k.items = k.items.filter(i => !i.tambahan); });
  (TOKO.menuBaru || []).forEach(m => {
    const k = MENU.find(x => x.id === m.kat);
    if (!k || !m.nama || !m.id) return;
    const item = { id: m.id, nama: m.nama, harga: +m.harga || 0, tambahan: true };
    if (m.level || m.rasa || m.topping) { item.pilih = true; item.ket = "Bisa pilih level pedas"; }
    if (m.rasa) item.rasa = true;
    if (m.topping === "seblak" && typeof TP_SEBLAK !== "undefined") item.topping = TP_SEBLAK;
    if (m.topping === "mie" && typeof TP_MIE !== "undefined") item.topping = TP_MIE;
    if (item.rasa || item.topping) item.ket = "Pilih rasa, level & topping";
    HARGA_ASLI[m.id] = item.harga;
    k.items.push(item);
  });
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
let TOKO_JSON = "";
try { TOKO_JSON = localStorage.getItem("toko-set") || ""; terapkanToko(JSON.parse(TOKO_JSON || "null")); } catch (e) { terapkanToko(null); }

// Ambil pengaturan terbaru. Mengembalikan true kalau ada perubahan.
async function ambilToko(url) {
  url = url || KEDAI.api;
  if (!url) return false;
  try {
    const r = await fetch(url + "?aksi=toko&_=" + Date.now() + Math.random().toString(36).slice(2,6), {cache: "no-store"});
    const j = await r.json();
    if (!j.ok) return false;
    const baru = JSON.stringify(j.toko || {});
    if (baru === TOKO_JSON) return false;
    TOKO_JSON = baru;
    try { localStorage.setItem("toko-set", baru); } catch (e) {}
    terapkanToko(j.toko);
    return true;
  } catch (e) { return false; }
}
