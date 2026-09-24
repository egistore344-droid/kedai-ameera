/* ============================================================
   DATA KEDAI & MENU — dipakai bersama oleh website (index.html)
   dan aplikasi kasir (kasir.html). Ubah harga/menu cukup di sini.
   ============================================================ */
const KEDAI = {
  // Link Apps Script (Web app URL) — dipakai website untuk membaca pengaturan toko
  api:    "https://script.google.com/macros/s/AKfycbyWFdxY-Okd7YjSLrnfv0rvIZXD4Cf9kwlbzmYnPsZHJJ5fAHzXGOk3uuXV3k4VOc2M/exec",
  nama:   "Kedai Jajanan AMEERA",
  wa:     "62881023089937",          // nomor WA kedai, awali 62 (bukan 0)
  alamatSingkat: "Graha Purwadadi Village A/9",
  alamat: "Perumahan Graha Purwadadi Village Blok A No. 9, Blendung, Kec. Purwadadi, Kab. Subang",
  jamBuka:  10,                      // jam buka (WIB)
  jamTutup: 18,                      // jam tutup (WIB) — di luar jam ini tidak bisa pesan
  ongkir: "Ongkir dikonfirmasi lewat WhatsApp.",
  // Isi nomor rekening / e-wallet di sini. Kalau kosong, nomor dikirim lewat WhatsApp.
  // Contoh: rekening: ["DANA 0881xxxxxxx a.n. Nama", "BRI 1234xxxx a.n. Nama"],
  rekening: [],
  // Promo "Share & dapat gratis": 1 minuman/cemilan gratis dengan harga maksimal ini
  bonusShare: { maks: 5000 },
  // Voucher di struk: kumpulkan sejumlah struk, tukar 1 menu gratis
  voucher: { jumlah: 10, minBelanja: 10000, berlakuHari: 60, hadiah: ["sb-ori", "ms-ori"] },
  instagram: "",                     // username IG kedai tanpa @ (kosongkan kalau belum ada)
  codAntar: false,                   // false = pesanan antar wajib transfer dulu (anti iseng)
  gratisOngkir: {makananSaja:4, makanan:3, minuman:2} // gratis ongkir: 4 makanan, ATAU 3 makanan + 2 minuman/cemilan
};

const RASA = ["Pedas", "Pedas manis", "Asam pedas"];
const LEVEL = ["Tidak pedas", "Sedikit pedas", "Pedas sedang", "Pedas", "Pedas banget", "Pedas nampol"]; // level 0–5
// Harga tambahan per topping (isi 0 kalau gratis)
const TOPPING = [
  {nama:"Ceker", harga:2000},
  {nama:"Tulang", harga:2000},
  {nama:"Siomay kering", harga:2000},
  {nama:"Cuanki lidah", harga:2000},
  {nama:"Cikua", harga:2000},
  {nama:"Baso", harga:2000}
];
// Topping yang tersedia untuk tiap menu
const TP_SEBLAK = ["Ceker","Tulang","Siomay kering","Cuanki lidah","Cikua"];
const TP_MIE    = [...TP_SEBLAK, "Baso"];

const MENU = [
  {id:"seblak", judul:"Seblak", sub:"Pilih level pedas 0–5 dan topping", unggulan:true, items:[
    {id:"sb-ori", nama:"Seblak Original", harga:12000, pilih:true, topping:TP_SEBLAK, rasa:true},
    {id:"sb-kom", nama:"Seblak Komplit",  harga:20000, pilih:true, topping:TP_SEBLAK, rasa:true}
  ]},
  {id:"mieseblak", judul:"Mie Seblak", sub:"Pilih level pedas 0–5 dan topping", unggulan:true, items:[
    {id:"ms-ori", nama:"Mie Seblak Original", harga:13000, pilih:true, topping:TP_MIE, rasa:true},
    {id:"ms-kom", nama:"Mie Seblak Komplit",  harga:20000, pilih:true, topping:TP_MIE, rasa:true}
  ]},
  {id:"lain", judul:"Makanan Lain", items:[
    {id:"mg",  nama:"Mie Goreng",     harga:8000},
    {id:"mk",  nama:"Mie Kuah",       harga:8000},
    {id:"spt", nama:"Spageti Tulang", harga:15000, pilih:true, ket:"Bisa pilih level pedas"},
    {id:"lb",  nama:"Lumpia Basah",   harga:15000, pilih:true, ket:"Bisa pilih level pedas"}
  ]},
  {id:"cemilan", judul:"Cemilan", minuman:true, items:[
    {id:"kg", nama:"Kentang Goreng",  harga:7000},
    {id:"ng", nama:"Nugget",          harga:5000},
    {id:"bs", nama:"Basreng",         harga:5000},
    {id:"sg", nama:"Sosis Goreng",    harga:6000},
    {id:"oo", nama:"Otak-otak",       harga:5000},
    {id:"tp", nama:"Telor Puyuh",     harga:5000},
    {id:"ta", nama:"Telor Ayam",      harga:5000},
    {id:"tt", nama:"Telor Terigu",    harga:5000},
    {id:"ks", nama:"Kerupuk Sambal",  harga:5000},
    {id:"cr", nama:"Cireng Sambal",   harga:5000}
  ]},
  {id:"dingin", judul:"Minuman Dingin", minuman:true, items:[
    {id:"am",  nama:"Air Mineral",        harga:3000},
    {id:"tpk", nama:"Teh Pucuk",          harga:5000},
    {id:"tj",  nama:"Tea Jus",            harga:3000},
    {id:"ns",  nama:"Nutrisari",          harga:4000},
    {id:"mm",  nama:"Marimas",            harga:3000},
    {id:"tm",  nama:"Es Teh Manis",       harga:3000},
    {id:"esc", nama:"Es Susu Coklat",     harga:5000},
    {id:"esp", nama:"Es Susu Putih",      harga:5000},
    {id:"gd",  nama:"Es Good Day Freeze", harga:5000},
    {id:"ej",  nama:"Es Jeruk Peras",     harga:5000}
  ]},
  {id:"panas", judul:"Minuman Panas", minuman:true, items:[
    {id:"kp",  nama:"Kopi",              harga:3000},
    {id:"scp", nama:"Susu Coklat Panas", harga:5000},
    {id:"spp", nama:"Susu Putih Panas",  harga:5000}
  ]}
];
/* ============================================================ */
