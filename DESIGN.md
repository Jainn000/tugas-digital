# DESIGN TOKENS: Kinetik Event Production & Organizer (KINETIK EO)

## 1. Gaya Visual: High-Impact Neubrutalism
Gaya visual mengadaptasi estetika poster gigs independen, tiket konser festival, dan papan jadwal panggung: garis hitam tebal, bayangan offset tanpa blur, palet warna solid kontras tinggi, dan tata letak padat berkarakter.

## 2. Palet Warna (Solid Ink, Tanpa Gradien Ungu/Neon)
- **Primary Ink:** `#000000` (Hitam murni untuk teks, garis border, dan bayangan hard offset)
- **Canvas Base:** `#FFFDF0` (Kuning gading lembut untuk latar belakang halaman)
- **Highlighter Yellow:** `#FFE600` (Warna aksen utama hero card, tombol konfirmasi booking)
- **Stage Lime:** `#A3E635` (Indikator status lunas / tiket aktif / paket siap jalan)
- **Festival Orange:** `#FF5C00` (Aksen tiket VIP dan promosi kuota terbatas)
- **Card Surface:** `#FFFFFF` (Permukaan kartu formulir dan faktur cetak)

## 3. Ketentuan Geometri & Bayangan
- **Borders:** Border hitam tegas `border-2 border-black` (2px) hingga `border-4 border-black` (4px). Tidak boleh menggunakan border 1px (*hairline*).
- **Corner Radius:** Sudut tegas `rounded-none` atau lekukan mikro terukur `rounded-sm` (maksimal 2px).
- **Hard Offset Shadow:**
  - Standard Card: `box-shadow: 4px 4px 0px #000000` (`shadow-brutal`)
  - Elevated Modal/Hover: `box-shadow: 6px 6px 0px #000000` (`shadow-brutal-lg`)
  - Tidak ada shadow blur (`rgba(0,0,0,0.08)`) atau efek glow neon.

## 4. Tipografi & Kontras
- **Heading / Display:** Sans-serif bold hitam tebal (`font-black`), huruf kapital terukur untuk penamaan panggung dan jenis paket.
- **Body Text:** Sans-serif solid dengan bobot medium hingga tebal untuk keterbacaan tinggi.
- **Monospace Usage:** Hanya diizinkan pada cuplikan kode program atau tag `<code>`. Nomor invoice, tanggal booking, dan nominal rupiah menggunakan font sans-serif tebal.

## 5. Tata Letak Cetak (Print Optimizations)
- **Faktur Booking Resmi A4:** Margin 15mm, kop surat resmi KINETIK Event Production, rincian biaya teknis, termin pembayaran, dan stempel digital panitia.
- **Struk Kasir / E-Ticket Thermal 80mm:** Layout vertikal 72mm-80mm untuk printer thermal mini kasir atau pass masuk pintu venue.
