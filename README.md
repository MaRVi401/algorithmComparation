# 🚀 Pathfinding Labs: Algorithm Research Visualizer

**Pathfinding Labs** adalah platform simulasi dan visualisasi interaktif berbasis web untuk mengeksplorasi serta membandingkan performa algoritma pencarian jalur (*shortest pathfinding*). Proyek ini memadukan algoritma graf konvensional, *Reinforcement Learning* (Q-Learning), serta metode gabungan (*Hybrid Method*) dalam satu antarmuka yang responsif.

## ✨ Fitur Utama

* **Visualisasi Komparatif Multi-Algoritma**:
  * **Dijkstra**: Algoritma *uninformed search* yang menjamin rute terpendek secara mutlak melalui eksplorasi simpul yang sistematis.
  * **A* (A-Star)**: Algoritma *informed search* cerdas berbasis heuristik *Manhattan Distance* untuk mereduksi ruang pencarian memori secara signifikan.
  * **Q-Learning (Machine Learning)**: Agen AI berbasis *Reinforcement Learning* yang membentuk *Q-Table* melalui proses *trial and error* (persamaan Bellman) untuk inferensi instan.
  * **Hybrid Method (A* + Q-Learning)**: Pendekatan hibrida (*Reward Shaping*) yang menyuntikkan heuristik A* ke dalam eksplorasi Q-Learning untuk mempercepat konvergensi pelatihan.
* **Interactive Grid Board**: Lingkungan interaktif $20 \times 40$ (800 simpul) dengan dukungan *click-and-drag* untuk menggambar rintangan kustom.
* **Preset Skenario Lingkungan**: Pilihan skenario *Empty Grid*, *Random Obstacles* (probabilitas 25%), dan *Barrier Pattern* (hambatan linier).
* **Analitik Komputasi Real-Time**: Mengukur metrik *States Explored* (simpul dikunjungi), *Path Length* (panjang jalur), dan *Execution Time* (presisi mikrodetik via `performance.now()`).
* **Animasi Modern**: Antarmuka responsif dengan animasi real-time yang halus menggunakan **GSAP**.

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 7](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Animation Library**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
* **Architecture**: React Custom Hooks (`usePathfinding`) & Modular Components

## 🚀 Memulai (Local Setup)

1. **Clone repositori**:
```bash
git clone https://github.com/MaRVi401/algorithmComparation
cd algorithmComparation

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



## 🧠 Detail Metode Hibrida & Machine Learning

Aplikasi ini menyediakan dua mode pembelajaran berbasis *Reinforcement Learning*:

1. **Standard Q-Learning**: Dilatih hingga **1.000.000 episode** dengan strategi *Epsilon-Greedy* peluruhan eksponensial. Agen belajar secara mandiri hingga mencapai kondisi konvergen.
2. **Hybrid Method (Heuristic-Guided Q-Learning)**: Menggabungkan fungsi potensial *Manhattan Distance* A* ke dalam struktur *reward shaping* Q-Learning **(R' = R + F)**. Metode ini memangkas beban pelatihan secara drastis menjadi hanya **50.000 episode** tanpa mengorbankan responsivitas inferensi pasca-konvergensi.

Proses pelatihan dipantau secara visual melalui modal interaktif yang menampilkan tingkat eksplorasi **(ε)**, jumlah target ditemukan, serta progres persentase pelatihan.

## 📁 Struktur Proyek

```text
src/
├── assets/          # Aset gambar & SVG
├── components/      # Komponen UI Modular
│   ├── ErrorModal.jsx     # Modal penanganan error/jalur tak terjangkau
│   ├── GridBoard.jsx      # Antarmuka grid interaktif (20x40)
│   ├── Header.jsx         # Bar navigasi & statistik analitik
│   ├── Sidebar.jsx        # Panel kontrol preset & tombol algoritma
│   └── TrainingModal.jsx  # Overlay visualisasi progres pelatihan RL/Hybrid
├── hooks/
│   └── usePathfinding.js  # Core logic pathfinding, RL training, & state management
├── App.jsx          # Komponen utama & inisialisasi animasi GSAP
├── constants.js     # Konstanta grid, episode, & identifikasi algoritma
├── index.css        # Konfigurasi Tailwind CSS
└── main.jsx         # Entry point aplikasi React

```

---

**Dibuat untuk keperluan penelitian komparatif efisiensi algoritma pencarian jalur dan visualisasi data.**
