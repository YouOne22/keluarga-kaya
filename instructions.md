# KELUARGA KAYA

## Master Prompt Pembuatan Aplikasi

> **Nama aplikasi:** Keluarga Kaya
> **Tagline:** *Kelola Keuangan Keluarga, Menuju Masa Depan yang Lebih Baik*

---

## 1. Tujuan Aplikasi

**Keluarga Kaya** adalah aplikasi manajemen keuangan keluarga yang membantu seluruh anggota keluarga mengelola, mencatat, memantau, dan merencanakan kondisi keuangan keluarga dalam satu aplikasi.

Aplikasi tidak hanya digunakan untuk mencatat pemasukan dan pengeluaran, tetapi juga mencakup:

* Pengelolaan saldo keluarga
* Rekening dan sumber dana
* Pemasukan
* Pengeluaran
* Transfer antar akun
* Anggaran
* Target tabungan
* Tagihan rutin
* Hutang
* Piutang
* Cicilan
* Aset keluarga
* Investasi
* Kekayaan bersih / Net Worth
* Usaha atau bisnis keluarga
* Laporan keuangan
* Analisis kesehatan keuangan
* AI Financial Assistant

### Tujuan utama

Membantu keluarga:

1. Mengetahui kondisi keuangan saat ini.
2. Mengontrol pengeluaran.
3. Mengatur anggaran.
4. Meningkatkan tabungan.
5. Mengelola hutang dan cicilan.
6. Memantau aset dan investasi.
7. Mengelola keuangan bisnis keluarga.
8. Mengetahui kekayaan bersih keluarga.
9. Merencanakan tujuan keuangan.
10. Mendapatkan insight keuangan melalui AI.

---

# 2. Konsep Desain UI/UX

Gunakan desain yang:

* Modern
* Clean
* Minimalist
* Friendly
* Professional
* Family-oriented
* Hangat
* Mudah digunakan
* Tidak terlalu formal
* Tidak terlihat seperti aplikasi bank

Gunakan:

* Rounded cards
* Soft shadows
* Whitespace yang cukup
* Icon modern
* Typography yang mudah dibaca
* Progress bar
* Grafik sederhana
* Micro interaction
* Animasi ringan dan halus

### Palet warna

| Warna         | Fungsi                            |
| ------------- | --------------------------------- |
| Hijau         | Saldo, pemasukan, kondisi positif |
| Putih         | Background                        |
| Orange/Kuning | Target dan perhatian              |
| Merah         | Pengeluaran, hutang, peringatan   |
| Biru          | Informasi                         |
| Ungu          | Investasi dan fitur tertentu      |

Gunakan **Bahasa Indonesia** untuk seluruh interface.

Saya juga sudah menambahkan referensi.png sebagai referensi tampilan

---

# 3. Branding

Nama aplikasi:

> **Keluarga Kaya**

Tagline:

> **Kelola Keuangan Keluarga, Menuju Masa Depan yang Lebih Baik**

### Konsep logo

Gunakan kombinasi:

* Rumah
* Keluarga
* Pertumbuhan
* Keuangan
* Kesejahteraan

Logo harus terasa:

* Hangat
* Positif
* Aman
* Keluarga
* Sejahtera

Jangan membuat logo terlihat seperti logo bank atau perusahaan finansial korporat.

---

# 4. Platform

Aplikasi harus responsive dan optimal untuk:

* Smartphone
* Tablet
* Desktop
* Web

Prioritaskan pengalaman pengguna smartphone.

### Bottom Navigation

Pada smartphone gunakan:

1. Beranda
2. Transaksi
3. Anggaran
4. Target
5. Profil

Fitur lain dapat diakses melalui dashboard dan menu tambahan.

---

# 5. Authentication

Implementasikan:

* Register
* Login
* Logout
* Lupa password
* Reset password
* Session management

Setelah login, pengguna dapat:

* Membuat keluarga baru
* Bergabung dengan keluarga yang sudah ada

---

# 6. Sistem Keluarga

Setiap pengguna tergabung dalam sebuah keluarga.

Data keluarga:

* Nama keluarga
* Foto keluarga
* Deskripsi
* Tanggal dibuat

Contoh:

> **Keluarga Kami**

---

# 7. Anggota Keluarga

Anggota keluarga dapat terdiri dari:

* Ayah
* Ibu
* Anak
* Saudara
* Anggota lainnya

Setiap anggota memiliki:

* Nama
* Foto/avatar
* Role
* Status
* Tanggal bergabung

## Role Admin

Admin dapat:

* Mengelola keluarga
* Mengundang anggota
* Menghapus anggota
* Mengatur role
* Mengatur permission
* Mengelola kategori
* Mengelola akun keluarga
* Mengatur konfigurasi keluarga

## Role Anggota

Anggota dapat:

* Melihat seluruh kondisi keuangan keluarga
* Melihat transaksi
* Menambahkan transaksi
* Mengedit transaksi
* Melihat anggaran
* Melihat target
* Melihat aset
* Melihat hutang
* Melihat investasi
* Melihat bisnis keluarga
* Melihat laporan

> **Penting:** Semua anggota keluarga yang telah bergabung dapat melihat data keuangan keluarga.

Tidak boleh ada anggota keluarga yang secara default disembunyikan dari informasi keuangan keluarga.

Admin tetap memiliki hak pengelolaan konfigurasi dan anggota.

---

# 8. Dashboard / Beranda

Dashboard adalah pusat informasi keuangan keluarga.

### Header

Tampilkan:

> **Halo, Keluarga Kami 👋**

Subjudul:

> *Semoga hari ini penuh berkah!*

Tampilkan ikon:

* Notifikasi
* Profil/avatar keluarga

---

# 9. Total Kekayaan

Tampilkan card utama:

> **Kekayaan Bersih**

Contoh:

> **Rp 125.500.000**

Formula:

```text
Kekayaan Bersih = Total Aset - Total Hutang
```

Tambahkan tombol:

* Show nominal
* Hide nominal

---

# 10. Ringkasan Keuangan

Tampilkan:

### Saldo

> Rp 12.450.000

### Pemasukan Bulan Ini

> Rp 5.000.000

### Pengeluaran Bulan Ini

> Rp 1.500.000

### Tabungan Bulan Ini

> Rp 2.000.000

Gunakan card yang sederhana dan mudah dipahami.

---

# 11. Kondisi Keuangan

Tampilkan:

> **Kesehatan Keuangan Keluarga**

Contoh:

> **82 / 100**

Status:

> **Sehat**

Indikator dapat dihitung dari:

* Rasio tabungan
* Rasio hutang
* Pengeluaran
* Dana darurat
* Stabilitas pemasukan
* Pertumbuhan aset

Berikan penjelasan sederhana.

Contoh:

> "Keuangan keluarga Anda tergolong sehat. Namun pengeluaran hiburan bulan ini meningkat."

---

# 12. Quick Action

Pada dashboard buat tombol utama:

> **+ Transaksi**

Ketika ditekan, tampilkan pilihan:

* Pemasukan
* Pengeluaran
* Transfer
* Pembayaran Hutang
* Tambah Tabungan
* Tambah Aset

---

# 13. Transaksi

Buat sistem transaksi lengkap.

Jenis transaksi:

## Pemasukan

Kategori default:

* Gaji
* Bonus
* Usaha
* Penjualan
* Freelance
* Hadiah
* Investasi
* Lainnya

## Pengeluaran

Kategori default:

* Makan
* Belanja
* Listrik
* Air
* Internet
* Transportasi
* Pendidikan
* Kesehatan
* Cicilan
* Hiburan
* Rumah Tangga
* Lainnya

---

# 14. Tambah Transaksi

Di bagian atas terdapat pilihan:

```text
[Pemasukan] [Pengeluaran]
```

Field:

* Kategori
* Nominal
* Akun/sumber dana
* Tanggal
* Waktu
* Keterangan
* Anggota yang melakukan transaksi

Format nominal:

> Rp 1.500.000

### Validasi

* Nominal wajib diisi
* Kategori wajib diisi
* Akun wajib diisi
* Tanggal wajib diisi

Setelah berhasil:

> **Transaksi berhasil disimpan.**

---

# 15. Akun / Sumber Dana

Pengguna dapat membuat akun:

* Cash
* Bank
* E-wallet
* Tabungan
* Rekening bisnis
* Lainnya

Contoh:

```text
BCA
Rp 8.500.000

BRI
Rp 3.000.000

Cash
Rp 950.000

E-wallet
Rp 250.000
```

Saldo otomatis berubah berdasarkan transaksi.

### Pemasukan

```text
Saldo akun bertambah
```

### Pengeluaran

```text
Saldo akun berkurang
```

---

# 16. Transfer Antar Akun

Buat fitur transfer.

Contoh:

```text
BCA → Cash
Rp 1.000.000
```

Transfer antar akun **tidak dianggap sebagai pemasukan atau pengeluaran** agar laporan keuangan tetap akurat.

Dukung juga:

```text
Bisnis → Keluarga
Keluarga → Bisnis
```

---

# 17. Anggaran

Buat sistem anggaran.

Periode:

* Mingguan
* Bulanan
* Custom

Contoh:

```text
Makan
Rp 1.000.000 / Rp 1.500.000
67%

Transportasi
Rp 300.000 / Rp 500.000
60%

Belanja
Rp 700.000 / Rp 1.000.000
70%

Hiburan
Rp 300.000 / Rp 500.000
60%
```

Gunakan progress bar.

### Status

🟢 Aman

🟡 Mendekati batas

🔴 Melebihi anggaran

---

# 18. Target Tabungan

Buat fitur target tabungan.

Kategori:

* Pendidikan
* Rumah
* Kendaraan
* Liburan
* Pernikahan
* Dana Darurat
* Modal Usaha
* Target lainnya

Setiap target memiliki:

* Nama target
* Nominal target
* Nominal terkumpul
* Deadline
* Icon
* Progress
* Status

Contoh:

```text
Dana Darurat

Rp 5.000.000 / Rp 15.000.000

33%
```

Sediakan tombol:

> **+ Tambah Target**

Pengguna dapat menambahkan dana ke target.

---

# 19. Tagihan Rutin

Buat sistem tagihan.

Contoh:

* Listrik
* Air
* Internet
* BPJS
* SPP
* Cicilan
* Langganan
* Pajak
* Lainnya

Data tagihan:

* Nama
* Nominal
* Jatuh tempo
* Frekuensi
* Akun pembayaran
* Status

Frekuensi:

* Mingguan
* Bulanan
* Tahunan

Sediakan notifikasi sebelum jatuh tempo.

---

# 20. Hutang

Buat modul:

> **Hutang Keluarga**

Jenis:

### Hutang kepada pihak lain

Contoh:

```text
Pinjaman dari Saudara
Rp 10.000.000
```

### Piutang

Uang yang dipinjam orang lain kepada keluarga.

Contoh:

```text
Piutang kepada Budi
Rp 2.000.000
```

Tampilkan:

* Total hutang
* Total piutang
* Hutang jatuh tempo
* Pembayaran terakhir
* Sisa hutang

---

# 21. Cicilan

Buat modul cicilan.

Contoh:

```text
KPR Rumah

Total:
Rp 300.000.000

Sudah dibayar:
Rp 75.000.000

Sisa:
Rp 225.000.000

Cicilan:
Rp 2.500.000 / bulan

Jatuh tempo:
Tanggal 10 setiap bulan
```

Tampilkan:

* Total hutang
* Sudah dibayar
* Sisa hutang
* Cicilan bulanan
* Tenor
* Sisa tenor
* Jatuh tempo
* Progress pembayaran

---

# 22. Aset Keluarga

Buat modul:

> **Aset Keluarga**

Kategori:

* Rumah
* Tanah
* Kendaraan
* Emas
* Tabungan
* Investasi
* Peralatan
* Bisnis
* Aset lainnya

Contoh:

```text
Rumah
Nilai estimasi:
Rp 350.000.000

Mobil
Nilai estimasi:
Rp 150.000.000

Emas
Nilai estimasi:
Rp 25.000.000
```

Tampilkan:

> **Total Aset**

> **Rp 525.000.000**

---

# 23. Investasi

Buat modul investasi.

Jenis:

* Emas
* Saham
* Reksa Dana
* Deposito
* Obligasi
* Properti
* Investasi lainnya

Data:

* Nama investasi
* Jenis
* Modal
* Nilai saat ini
* Keuntungan
* Persentase keuntungan
* Tanggal pembelian

Contoh:

```text
Emas

Modal:
Rp 10.000.000

Nilai sekarang:
Rp 12.500.000

Keuntungan:
Rp 2.500.000

Return:
+25%
```

---

# 24. Kekayaan Bersih / Net Worth

Ini merupakan salah satu fitur utama aplikasi.

Formula:

```text
Kekayaan Bersih = Total Aset - Total Hutang
```

Contoh:

```text
Total Aset:
Rp 525.000.000

Total Hutang:
Rp 225.000.000

Kekayaan Bersih:
Rp 300.000.000
```

Tampilkan grafik perkembangan kekayaan bersih.

Contoh:

```text
Januari   : Rp 250 juta
Februari  : Rp 265 juta
Maret     : Rp 280 juta
April     : Rp 300 juta
```

---

# 25. Usaha / Bisnis Keluarga

Buat modul:

> **Bisnis Keluarga**

Satu keluarga dapat memiliki satu atau beberapa bisnis.

Contoh:

* Warung Keluarga
* Laundry
* Toko Online
* Peternakan
* Pertanian
* Jasa
* Bisnis lainnya

Setiap bisnis memiliki:

* Nama bisnis
* Logo/foto
* Deskripsi
* Modal
* Pendapatan
* Pengeluaran
* Laba
* Hutang bisnis
* Aset bisnis

---

# 26. Keuangan Bisnis

Setiap bisnis memiliki transaksi sendiri.

Contoh:

### Pendapatan

```text
Penjualan Hari Ini
Rp 1.250.000
```

### Pengeluaran

```text
Belanja Bahan
Rp 450.000
```

### Laba

```text
Rp 800.000
```

Tampilkan:

* Omzet
* Biaya
* Laba kotor
* Laba bersih
* Margin laba
* Pertumbuhan omzet

---

# 27. Pemisahan Keuangan Bisnis dan Keluarga

Keuangan bisnis harus dapat dipisahkan dari keuangan rumah tangga.

Namun sistem harus memungkinkan transfer:

```text
Bisnis → Keluarga
```

Contoh:

```text
Pemilik mengambil laba usaha
Rp 2.000.000
```

Dicatat sebagai:

* Pengeluaran bisnis
* Pemasukan keluarga

Gunakan sistem transfer antar akun agar pencatatan tetap akurat.

---

# 28. Laporan Keuangan

## Laporan Keluarga

Tampilkan:

* Pemasukan
* Pengeluaran
* Tabungan
* Anggaran
* Hutang
* Piutang
* Aset
* Investasi
* Kekayaan bersih

## Laporan Bisnis

Tampilkan:

* Omzet
* Pengeluaran
* Laba
* Modal
* Margin
* Pertumbuhan bisnis

### Filter

* Mingguan
* Bulanan
* Tahunan
* Custom tanggal

---

# 29. Grafik

Gunakan grafik yang mudah dipahami.

Grafik:

* Pemasukan vs pengeluaran
* Pengeluaran berdasarkan kategori
* Perubahan saldo
* Tabungan
* Hutang
* Kekayaan bersih
* Pertumbuhan aset
* Pertumbuhan investasi
* Pertumbuhan bisnis

---

# 30. Kaya AI

Buat fitur AI bernama:

> **Kaya AI**

Kaya AI adalah asisten keuangan keluarga yang menganalisis data keuangan keluarga dan memberikan insight berdasarkan data aktual.

AI harus mampu menjelaskan kondisi keuangan menggunakan bahasa manusia yang sederhana.

Contoh:

> "Pengeluaran makan bulan ini naik 27% dibanding bulan lalu."

Contoh lain:

> "Pengeluaran keluarga bulan ini Rp500.000 lebih tinggi dibanding rata-rata 3 bulan terakhir."

> "Tabungan keluarga meningkat 15% bulan ini."

> "Hutang keluarga berkurang Rp2.000.000 bulan ini."

> "Jika pola pengeluaran saat ini terus berlanjut, anggaran belanja kemungkinan habis 5 hari lebih cepat."

---

# 31. AI Financial Recommendation

Kaya AI memberikan rekomendasi berdasarkan data aktual.

Contoh:

> "Anda menghabiskan Rp1.250.000 untuk makan bulan ini. Angka tersebut 25% lebih tinggi dibanding bulan lalu."

Kemudian:

> "Jika ingin menghemat Rp500.000 bulan depan, Anda dapat mengurangi pengeluaran makan sekitar Rp16.700 per hari."

AI tidak boleh memberikan rekomendasi tanpa dasar data.

---

# 32. AI Chat

Sediakan halaman:

> **Tanya Kaya AI**

Pengguna dapat bertanya:

```text
Berapa pengeluaran saya bulan ini?

Kategori apa yang paling banyak menghabiskan uang?

Apakah keuangan keluarga kami sehat?

Berapa total hutang kami?

Berapa total aset kami?

Berapa kekayaan bersih keluarga?

Berapa total penghasilan bisnis kami?

Berapa laba bisnis bulan ini?

Apakah kami mampu membeli motor tahun depan?

Berapa yang harus kami tabung setiap bulan untuk mencapai target Rp20 juta?
```

AI harus menjawab berdasarkan data keluarga yang sedang login.

---

# 33. AI Forecast

Kaya AI dapat melakukan prediksi sederhana berdasarkan histori keuangan.

Contoh:

> "Jika pola tabungan Anda tetap seperti 6 bulan terakhir, target Rp20.000.000 diperkirakan tercapai pada November."

Contoh:

> "Jika pengeluaran terus meningkat seperti bulan ini, saldo keluarga diperkirakan turun sekitar Rp2.000.000 bulan depan."

Gunakan bahasa:

* Sederhana
* Objektif
* Tidak menakut-nakuti
* Mudah dipahami

AI harus menjelaskan bahwa prediksi merupakan **estimasi**, bukan kepastian.

---

# 34. AI Financial Health Score

Buat:

> **Skor Kesehatan Keuangan**

Contoh:

> **82 / 100**

Komponen:

* Rasio tabungan
* Rasio hutang
* Dana darurat
* Stabilitas pemasukan
* Pengeluaran
* Pertumbuhan aset
* Pertumbuhan kekayaan bersih

Contoh hasil:

> **Skor Anda 82. Kondisi keuangan tergolong sehat.**

Kemudian berikan rekomendasi:

> "Hal yang perlu diperhatikan: hutang konsumtif masih cukup tinggi."

---

# 35. Notifikasi Cerdas

Contoh:

> "Anggaran makan sudah mencapai 85%."

> "Tagihan listrik jatuh tempo besok."

> "Target dana darurat sudah mencapai 60%."

> "Pengeluaran bulan ini meningkat 18%."

> "Cicilan kendaraan jatuh tempo 3 hari lagi."

> "Selamat! Kekayaan bersih keluarga meningkat Rp5 juta bulan ini."

> "Omzet bisnis meningkat 12% dibanding bulan lalu."

---

# 36. Search

Buat pencarian global.

Dapat mencari:

* Transaksi
* Anggota
* Akun
* Anggaran
* Target
* Hutang
* Piutang
* Aset
* Investasi
* Bisnis
* Tagihan

---

# 37. Profil

Tampilkan:

* Foto keluarga
* Nama keluarga
* Jumlah anggota

Menu:

* Anggota Keluarga
* Akun
* Kategori
* Bisnis
* Pengaturan
* Notifikasi
* Keamanan
* Bantuan
* Tentang Aplikasi

Tombol:

> **Keluar**

---

# 38. Onboarding

Saat pertama kali menggunakan aplikasi:

### Step 1

> "Selamat datang di Keluarga Kaya."

### Step 2

> "Buat keluarga Anda."

### Step 3

> "Tambahkan anggota keluarga."

### Step 4

> "Tambahkan akun keuangan."

### Step 5

> "Catat transaksi pertama."

### Step 6

> "Mulai kelola keuangan keluarga."

---

# 39. Empty State

Jika belum memiliki transaksi:

> **Belum ada transaksi.**

> "Yuk mulai mencatat keuangan keluarga."

Button:

> **Tambah Transaksi**

Jika belum memiliki aset:

> **Belum ada aset.**

> "Tambahkan aset keluarga untuk mengetahui total kekayaan."

Jika belum memiliki target:

> **Belum ada target tabungan.**

> "Buat target pertama untuk mulai merencanakan masa depan."

---

# 40. Error Handling

Jangan menampilkan error teknis kepada pengguna.

### Jangan gunakan:

```text
Database exception.
```

### Gunakan:

> "Maaf, data belum dapat disimpan. Silakan coba lagi."

Berikan feedback yang jelas untuk:

* Error
* Loading
* Success
* Validation
* Network failure

---

# 41. Database

Gunakan struktur database yang terorganisir.

Minimal tabel:

```text
users
families
family_members

accounts
categories
transactions

budgets
budget_categories

saving_goals
saving_goal_deposits

recurring_bills

debts
debt_payments

assets
investments

businesses
business_accounts
business_transactions

notifications

ai_conversations
ai_messages

net_worth_snapshots

audit_logs
```

---

# 42. Family Data Isolation

**Sangat penting.**

Setiap data keuangan harus memiliki relasi:

```text
family_id
```

Data keluarga A tidak boleh dapat diakses oleh keluarga B.

Authorization harus dilakukan di:

* Backend
* Database
* API

Jangan hanya mengandalkan filtering di frontend.

---

# 43. Audit Log

Catat aktivitas penting.

Contoh:

```text
Ibu menambahkan transaksi Rp250.000.

Ayah mengubah anggaran makan.

Ibu menambahkan target dana darurat.

Admin mengundang anggota baru.

Ayah menambahkan aset kendaraan.

Ibu membayar cicilan Rp2.500.000.
```

Simpan:

* User
* Aktivitas
* Data terkait
* Timestamp

---

# 44. Keamanan

Implementasikan:

* Authentication
* Authorization
* Secure session
* Password hashing
* Role management
* Family-level data isolation
* Input validation
* Server-side validation
* Database security
* API security

Data finansial keluarga harus dianggap sebagai data sensitif.

Jangan pernah membagikan data keluarga kepada pengguna di luar keluarga.

---

# 45. Format Indonesia

Gunakan Bahasa Indonesia.

### Mata uang

```text
Rp 12.450.000
```

Jangan gunakan:

```text
12,450,000 IDR
```

### Tanggal

```text
10 September 2026
```

### Waktu

Gunakan format:

```text
10:30
```

---

# 46. Dashboard Priority

Dashboard harus memberikan informasi penting dalam waktu kurang dari 5 detik.

Urutan informasi:

1. Kekayaan Bersih
2. Saldo
3. Pemasukan
4. Pengeluaran
5. Kondisi Keuangan
6. Transaksi Terbaru
7. Anggaran
8. Target
9. Hutang
10. Insight Kaya AI

---

# 47. Demo Data

Gunakan data demo berikut untuk environment demo/development:

### Keuangan

```text
Saldo:
Rp 12.450.000

Pemasukan:
Rp 5.000.000

Pengeluaran:
Rp 1.500.000

Total Aset:
Rp 525.000.000

Total Hutang:
Rp 225.000.000

Kekayaan Bersih:
Rp 300.000.000
```

### Transaksi

```text
Gaji
+ Rp 5.000.000

Belanja Bulanan
- Rp 350.000

Listrik
- Rp 250.000

Transportasi
- Rp 150.000

Makan
- Rp 200.000
```

### Bisnis

```text
Warung Keluarga

Omzet:
Rp 12.500.000

Pengeluaran:
Rp 7.500.000

Laba:
Rp 5.000.000
```

---

# 48. UX Principles

Aplikasi harus:

* Mudah digunakan
* Tidak membingungkan
* Tidak terlalu banyak field
* Cepat mencatat transaksi
* Mudah membaca kondisi keuangan
* Ramah untuk pengguna non-teknis
* Cocok digunakan bersama seluruh anggota keluarga

Target pengguna:

> Orang tua dan keluarga umum yang tidak terbiasa menggunakan aplikasi keuangan.

---

# 49. Performance

Pastikan:

* Loading cepat
* Pagination untuk transaksi
* Lazy loading jika diperlukan
* Query database efisien
* Caching yang aman
* Tidak melakukan query database yang tidak diperlukan
* Grafik tidak menyebabkan UI lambat

---

# 50. Responsive UI

Pastikan seluruh halaman bekerja pada:

* Mobile portrait
* Mobile landscape
* Tablet
* Desktop

Layout harus adaptif.

---

# 51. Design System

Gunakan design system yang konsisten di seluruh aplikasi.

Komponen:

* Typography
* Colors
* Spacing
* Button
* Card
* Input
* Select
* Modal
* Dialog
* Toast
* Icon
* Badge
* Progress bar
* Navigation
* Bottom navigation
* Table
* Chart

Jangan membuat setiap halaman memiliki gaya visual yang berbeda.

---

# 52. Implementation Priority

Bangun aplikasi secara bertahap.

## PHASE 1 — CORE

* Authentication
* Family
* Members
* Dashboard
* Accounts
* Transactions

## PHASE 2 — FINANCIAL MANAGEMENT

* Budgets
* Saving Goals
* Bills
* Debts
* Piutang
* Installments

## PHASE 3 — WEALTH

* Assets
* Investments
* Net Worth

## PHASE 4 — BUSINESS

* Family Businesses
* Business Accounts
* Business Transactions
* Business Reports

## PHASE 5 — ANALYTICS

* Reports
* Charts
* Financial Health Score

## PHASE 6 — AI

* Kaya AI
* Financial Analysis
* Recommendations
* Forecast
* AI Chat

## PHASE 7 — POLISH

* Notifications
* Animations
* Empty states
* Error handling
* Security hardening
* Performance optimization
* Responsive optimization

---

# 53. Aturan Penting untuk AI Coding Agent

Jangan membuat aplikasi hanya sebagai mockup statis.

Semua fitur utama harus benar-benar terhubung dengan database.

Implementasikan CRUD:

```text
Create
Read
Update
Delete
```

Semua tombol harus memiliki fungsi.

Semua navigasi harus berfungsi.

Data yang ditambahkan harus tersimpan.

Data yang diedit harus diperbarui.

Data yang dihapus harus benar-benar dihapus atau menggunakan soft delete sesuai kebutuhan.

Jangan membuat data dummy permanen setelah aplikasi terhubung dengan database.

---

# 54. Aturan AI

AI harus menggunakan data aktual keluarga yang sedang login.

AI tidak boleh:

* Mengarang data
* Mengarang transaksi
* Mengarang saldo
* Mengarang hutang
* Mengarang aset
* Mengarang laporan

Jika data tidak tersedia, AI harus mengatakan bahwa data tersebut belum tersedia.

Contoh:

> "Saya belum menemukan data pengeluaran bulan ini."

AI harus membedakan antara:

* Fakta
* Perhitungan
* Estimasi
* Prediksi
* Rekomendasi

Untuk prediksi dan rekomendasi, gunakan bahasa yang menunjukkan bahwa hasil tersebut merupakan estimasi.

---

# 55. Financial Calculation Rules

Pastikan perhitungan finansial dilakukan secara akurat.

### Saldo

```text
Saldo = Total Pemasukan - Total Pengeluaran + Saldo Awal
```

### Kekayaan Bersih

```text
Net Worth = Total Aset - Total Hutang
```

### Laba Bisnis

```text
Laba Bersih = Total Pendapatan - Total Biaya
```

### Rasio Tabungan

```text
Rasio Tabungan =
(Tabungan / Total Pemasukan) × 100
```

### Rasio Hutang

```text
Rasio Hutang =
Total Hutang / Total Aset × 100
```

Pastikan transfer antar akun tidak dihitung sebagai pemasukan atau pengeluaran.

---

# 56. Financial Health Score

Buat sistem scoring yang transparan.

Contoh komponen:

```text
Tabungan             20%
Hutang               20%
Dana Darurat         20%
Stabilitas Pemasukan 15%
Pengeluaran          15%
Pertumbuhan Aset     10%
```

Tampilkan skor:

```text
80–100 = Sangat Sehat
60–79  = Sehat
40–59  = Perlu Perhatian
20–39  = Tidak Sehat
0–19   = Kritis
```

Sistem scoring harus dapat dikembangkan dan dikonfigurasi di masa depan.

---

# 57. Final Product Vision

Hasil akhir harus terasa seperti produk aplikasi sungguhan bernama:

# KELUARGA KAYA

Bukan sekadar template dashboard.

Aplikasi harus menjadi pusat pengelolaan:

```text
UANG
+
TABUNGAN
+
ANGGARAN
+
HUTANG
+
CICILAN
+
ASET
+
INVESTASI
+
BISNIS
+
PERENCANAAN
+
ANALISIS
+
AI
```

Semua dalam satu aplikasi keluarga.

---

# 58. Prinsip Utama Produk

Keluarga Kaya harus memiliki filosofi:

> **"Sederhana digunakan oleh keluarga, tetapi kuat di belakang layar."**

Pengguna awam harus dapat mencatat transaksi hanya dalam beberapa detik.

Sementara sistem di belakang layar harus mampu mengolah:

* Keuangan keluarga
* Aset
* Hutang
* Bisnis
* Tabungan
* Investasi
* Kekayaan bersih
* Analisis
* Prediksi
* Insight AI

---

# 59. Definition of Done

Aplikasi dianggap siap apabila:

* [ ] Register berfungsi
* [ ] Login berfungsi
* [ ] Logout berfungsi
* [ ] Membuat keluarga berfungsi
* [ ] Mengundang anggota berfungsi
* [ ] Semua anggota dapat melihat keuangan keluarga
* [ ] Dashboard berfungsi
* [ ] Tambah pemasukan berfungsi
* [ ] Tambah pengeluaran berfungsi
* [ ] Transfer antar akun berfungsi
* [ ] Saldo otomatis diperbarui
* [ ] Anggaran berfungsi
* [ ] Target tabungan berfungsi
* [ ] Tagihan berfungsi
* [ ] Hutang berfungsi
* [ ] Piutang berfungsi
* [ ] Cicilan berfungsi
* [ ] Aset berfungsi
* [ ] Investasi berfungsi
* [ ] Net Worth berfungsi
* [ ] Bisnis keluarga berfungsi
* [ ] Laporan berfungsi
* [ ] Grafik berfungsi
* [ ] Notifikasi berfungsi
* [ ] Kaya AI berfungsi
* [ ] AI menggunakan data aktual
* [ ] AI tidak mengarang data
* [ ] Family data isolation aman
* [ ] Audit log berfungsi
* [ ] Responsive di mobile
* [ ] Responsive di tablet
* [ ] Responsive di desktop
* [ ] Error handling tersedia
* [ ] Loading state tersedia
* [ ] Empty state tersedia
* [ ] Semua tombol berfungsi
* [ ] Tidak ada broken navigation
* [ ] Tidak ada halaman kosong
* [ ] Database tersimpan dengan benar
* [ ] Security rules telah diterapkan

---

# 60. Instruksi Terakhir untuk AI Coding Agent

Bangun aplikasi ini secara **production-oriented**, bukan sekadar prototype visual.

Sebelum melakukan implementasi:

1. Analisis seluruh requirement.
2. Buat arsitektur aplikasi.
3. Tentukan struktur database.
4. Tentukan relationship antar tabel.
5. Tentukan authentication dan authorization.
6. Tentukan API/backend architecture.
7. Tentukan design system.
8. Tentukan struktur folder/project.
9. Tentukan state management.
10. Tentukan strategi keamanan.

Kemudian implementasikan aplikasi secara bertahap berdasarkan phase yang telah ditentukan.

Setelah setiap phase selesai:

* Test seluruh fitur.
* Periksa database.
* Periksa authorization.
* Periksa responsive UI.
* Periksa error handling.
* Periksa navigation.
* Pastikan tidak ada regresi pada fitur sebelumnya.

Jangan melompat langsung membuat semua fitur tanpa memastikan fondasi aplikasi benar.

Prioritaskan:

> **Data integrity → Security → Functionality → UX → Visual polish**

Hasil akhir harus berupa aplikasi **Keluarga Kaya** yang benar-benar dapat digunakan keluarga untuk mengelola kondisi keuangan mereka secara bersama-sama.
