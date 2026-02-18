# 🚀 Pathfinding Labs: Algorithm Research Visualizer

**Pathfinding Labs** adalah platform visualisasi interaktif untuk mengeksplorasi dan membandingkan efisiensi berbagai algoritma pencarian jalur (*pathfinding*). Proyek ini memadukan algoritma klasik berbasis graf dengan agen cerdas berbasis *Reinforcement Learning* (Q-Learning).

## ✨ Fitur Utama

* **Visualisasi Multi-Algoritma**: Bandingkan performa algoritma secara *real-time*:
* **Dijkstra**: Menjamin jalur terpendek dengan mengeksplorasi semua kemungkinan.
* **A* (A-Star)**: Algoritma cerdas berbasis heuristik untuk pencarian yang lebih cepat.
* **Q-Learning (Machine Learning)**: Agen AI yang belajar menemukan jalur melalui ribuan iterasi *trial and error* menggunakan persamaan Bellman.


* **Interactive Grid**: Buat rintangan (*walls*) sendiri dengan klik dan geser mouse pada grid berukuran 20x40.
* **Preset Lingkungan**: Pilihan *grid* kosong, rintangan acak (*random*), atau pola hambatan tertentu (*barrier*).
* **Analitik Mendalam**: Menampilkan statistik jumlah *state* yang dijelajahi, panjang jalur akhir, dan waktu komputasi dalam milidetik.
* **Animasi Modern**: Antarmuka responsif dengan animasi halus menggunakan **GSAP**.

## 🛠️ Tech Stack

* **Frontend**: [React 19](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Animation**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
* **State Management**: React Hooks (useState, useEffect, useRef)

## 🚀 Memulai (Local Setup)

1. **Clone repositori**:
```bash
https://github.com/MaRVi401/algorithmComparation
cd algorithmcomparation

```


2. **Instal dependensi**:
```bash
npm install

```


3. **Jalankan server pengembangan**:
```bash
npm run dev

```


4. **Build untuk produksi**:
```bash
npm run build

```



## 🧠 Detail Algoritma Machine Learning

Pada mode **Q-Learning**, aplikasi ini menjalankan fase pelatihan intensif sebanyak **5.000 hingga 1.000.000 episode**. Agen menggunakan strategi *Epsilon-Greedy* untuk menyeimbangkan antara eksplorasi area baru dan eksploitasi jalur yang sudah diketahui. Anda dapat memantau proses belajar agen melalui *overlay* progres yang interaktif.

## 📁 Struktur Proyek

* `src/App.jsx`: Logika utama aplikasi, manajemen grid, dan implementasi algoritma.
* `src/main.jsx`: Entry point aplikasi.
* `vite.config.js`: Konfigurasi Vite dengan dukungan Tailwind CSS.
* `eslint.config.js`: Aturan linting untuk menjaga kualitas kode.

---

*Dibuat untuk keperluan penelitian algoritma dan visualisasi data.*
