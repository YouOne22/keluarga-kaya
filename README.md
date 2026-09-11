# 💰 Keluarga Kaya

Aplikasi keuangan keluarga dengan input transaksi via WhatsApp.

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, PostgreSQL, Realtime)
- **WhatsApp**: Fonnte API
- **Deploy**: Vercel + GitHub

## Fitur MVP

- ✅ Login / Register (Supabase Auth)
- ✅ Dashboard keuangan keluarga
- ✅ Catat transaksi via aplikasi
- ✅ Catat transaksi via WhatsApp (`keluar 85000 makan siang`)
- ✅ Konfirmasi WA: `SIMPAN` / `BATAL`
- ✅ Notifikasi dalam aplikasi untuk pasangan
- ✅ Multi-keluarga (RLS terisolasi)

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd KELUARGA-KAYA
npm install
```

### 2. Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**
3. Jalankan isi `supabase/migrations/001_initial_schema.sql`
4. Copy **Project URL** dan **Anon Key** dari Settings → API

### 3. Fonnte

1. Daftar di [fonnte.com](https://fonnte.com)
2. Hubungkan nomor WhatsApp (nomor bot khusus)
3. Aktifkan **Auto Read** dan **Webhook** di dashboard Fonnte
4. Isi Webhook URL: `https://<your-domain>/api/fonnte/webhook`
5. Copy **Token** dari dashboard Fonnte

### 4. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
FONNTE_TOKEN=your-token
FONNTE_BOT_NUMBER=62xxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run

```bash
npm run dev
```

Buka `http://localhost:3000`

## Setup Nomor WhatsApp Bot

**Penting**: Gunakan nomor WhatsApp khusus untuk bot, bukan nomor pribadi.

1. Beli nomor baru (kartu SIM / eSIM)
2. Daftar WhatsApp dengan nomor tersebut
3. Hubungkan ke Fonnte
4. Simpan nomor bot di env: `FONNTE_BOT_NUMBER=62xxxxxxxxxx`
5. Daftarkan nomor Anda dan istri di `household_members.phone_number`

## Format Pesan WhatsApp

```
keluar 85000 makan siang
masuk 5000000 gaji bulanan
beli 200000 belanja mingguan
```

Bot akan merespons:

```
📋 Konfirmasi Transaksi

Pengeluaran: Rp85.000
Catatan: Makan siang
Kategori: Makanan

Balas SIMPAN atau BATAL
```

## Arsitektur

```
User → WhatsApp → Fonnte Webhook → API Route → Supabase DB
                                                   ↓
User ← WhatsApp ← Fonnte API ← API Route ← Realtime → Aplikasi
```

## Catatan Penting

- Fonnte bukan WhatsApp Official API — ada risiko nomor diblokir
- Gunakan nomor bot terpisah, bukan nomor pribadi
- Webhook harus di HTTPS (Vercel default HTTPS)
- Draft transaksi expire dalam 10 menit
- Data keuangan sensitif — jangan push `service_role_key` ke GitHub
- Struktur siap multi-keluarga untuk pengembangan selanjutnya
