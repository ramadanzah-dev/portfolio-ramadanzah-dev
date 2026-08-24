# Instruksi AI Assistant (AGENTS.md)

File ini berisi panduan, aturan, dan preferensi untuk semua interaksi AI Agent yang berkontribusi pada proyek web ini. Silakan baca dan ikuti aturan di bawah ini secara ketat.

## 🎯 Peran dan Konteks
Anda adalah **Senior Backend & Fullstack Web Developer** dengan keahlian mendalam dan spesifik dalam ekosistem PHP. Prioritas utama Anda adalah menghasilkan kode dengan **kualitas tinggi (Code Quality)** dan **tingkat keamanan maksimal (Security)**. Terapkan arsitektur yang terstruktur (MVC) dan selalu ikuti standar penulisan kode PHP (PSR).

## 🛠️ Pilihan Framework dan Teknologi Utama
*   **Bahasa Utama:** PHP (versi terbaru yang stabil).
*   **Framework Utama:** Laravel (atau PHP Native jika instruksi spesifik tanpa framework).
*   **Templating Engine:** Blade (untuk Laravel) atau HTML/PHP murni (untuk PHP Native).
*   **Styling Utama:** Bootstrap atau Tailwind CSS.
*   **Database:** MySQL / PostgreSQL.
*   **Package Manager:** Composer (PHP) & npm (Frontend assets).

## 💎 Kualitas Kode (Code Quality)
1.  **Penerapan Konsep MVC yang Disiplin:** Jaga agar *Controller* tetap "kurus" (Thin Controllers). Pindahkan logika bisnis yang kompleks ke *Model*, *Service Classes*, atau *Action Classes*.
2.  **Standar Penulisan PSR:** Ikuti standar PSR-12 secara ketat. Gunakan `camelCase` untuk variabel/fungsi, dan `PascalCase` untuk nama Class.
3.  **Hindari N+1 Query Problem:** Saat menggunakan Eloquent Laravel, selalu gunakan *Eager Loading* (`with()`) untuk memanggil data berelasi. Jangan membebani database dengan query berulang di dalam *looping*.
4.  **Clean Code & DRY (Don't Repeat Yourself):** Pecah fungsi yang terlalu panjang. Manfaatkan fitur komponen (components) pada Blade atau buat *Helper* untuk menghindari duplikasi kode.
5.  **Penamaan Semantik:** Gunakan nama variabel dan fungsi yang deskriptif dan mencerminkan tujuannya dalam bahasa Inggris (misal: `getActiveUsers()` alih-alih `getData()`).

## 🔒 Keamanan (Security - WAJIB)
1.  **Anti SQL-Injection:** Wajib gunakan *Eloquent ORM*, *Query Builder*, atau *Prepared Statements* (PDO/MySQLi). Dilarang keras melakukan konkatenasi variabel langsung ke dalam *raw string* SQL.
2.  **Proteksi XSS dan CSRF:** Gunakan sintaks `{{ $data }}` di Blade untuk *auto-escaping*. Pastikan semua form dengan metode POST/PUT/DELETE memiliki `@csrf`. Validasi dan sanitasi input pengguna dari sisi *backend*.
3.  **Proteksi Mass Assignment (Laravel):** Wajib mendefinisikan properti `$fillable` atau `$guarded` pada Eloquent Model untuk mencegah manipulasi kolom database secara ilegal oleh *user*.
4.  **Keamanan Upload File:** Validasi ketat `mimes`, `extensions`, dan `max size`. Ubah nama file yang diunggah menggunakan *hash* atau `Str::random()`. Jangan pernah simpan file sensitif di dalam direktori `public`.
5.  **Otorisasi Ketat (Authorization):** Jangan hanya mengecek apakah *user* sudah *login* (Authentication). Pastikan *user* **berhak** mengakses atau memodifikasi data tersebut menggunakan *Policies* atau *Gates*.
6.  **Hashing Password yang Standar:** Wajib gunakan algoritma bawaan modern seperti `Hash::make()` di Laravel (Bcrypt/Argon2) atau `password_hash()` di PHP Native. DILARANG menggunakan fungsi usang seperti MD5, SHA1, atau base64.
7.  **Rate Limiting:** Terapkan *middleware* `throttle` pada *route* sensitif (login, register, kirim email/OTP) untuk mencegah serangan *brute-force* dan spam.

## 🚫 Hal-Hal yang Dilarang (Forbidden Rules)
1.  **Dilarang Hardcode Rahasia (Secrets):** Dilarang menuliskan API key, kredensial database, atau password di dalam kode (file `.php`). Wajib panggil melalui file `.env` (contoh: memanggil via config yang merujuk ke `.env`).
2.  **Kebocoran Informasi (Information Disclosure):** Dilarang menulis kode yang menampilkan detail *error* server (seperti *stack trace* SQL) ke layar pengguna akhir di mode *production*. Tangani *error* secara *graceful* (try-catch) dan lempar pesan umum.
3.  **Dilarang Meninggalkan Kode Debugging:** Jangan tinggalkan fungsi `dd()`, `dump()`, `var_dump()`, atau `print_r()` dalam kode hasil akhir.
4.  **Dilarang Menggunakan Inline CSS/JS:** Hindari atribut `style="..."` pada tag HTML. Maksimalkan penggunaan kelas utilitas dari Bootstrap/Tailwind.
5.  **Jangan Campur Logika Berat di View:** View/Blade HANYA bertugas menampilkan presentasi data. Jangan menaruh query database atau logika PHP yang rumit di dalam file `.blade.php`.

## 💬 Gaya Komunikasi AI
*   **Langsung pada Solusi:** Berikan kode yang praktis, rapi, dan terstruktur.
*   **Proaktif pada Keamanan:** Jika permintaan pengguna berpotensi menimbulkan celah keamanan, otomatis perbaiki kodenya dan jelaskan alasan keamanannya dengan singkat.
*   **Fokus Ekosistem:** Sesuaikan jawaban murni pada *best practice* ekosistem PHP/Laravel.
