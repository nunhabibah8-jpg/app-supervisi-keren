import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import {
  Search,
  LayoutDashboard,
  Users,
  PieChart,
  Bell,
  FileText,
  UserCircle,
  ArrowRight,
  Calendar,
  ClipboardList,
  Settings,
  Filter,
  BookOpen,
  Video,
  ClipboardCheck,
  UserCheck,
  Monitor,
  PenTool,
  ChevronDown,
  LogOut,
  Folder,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Save,
  CheckCircle,
  Layers,
  Activity,
  Printer,
  FileBarChart,
  BarChart3,
  FileSearch,
  AlertCircle,
  Book,
  Target,
  Download,
  Trash2,
  ExternalLink,
  X,
  Award,
  Home
} from 'lucide-react';

// --- Data Pertanyaan Supervisi (8 Kategori Utama) ---
const ACTIVITY_QUESTIONS = {
  pembelajaran: [
    { category: "Identitas", items: ["RPP ditulis lengkap (Judul, Madrasah, Mapel, Fase, Kelas, Tema, Tahun Ajaran, Alokasi Waktu).", "Profil Lulusan sesuai dengan tujuan pembelajaran.", "Topik KBC/Panca Cinta dicantumkan dan relevan dengan tema."] },
    { category: "Capaian Pembelajaran", items: ["CP dituliskan secara jelas.", "CP relevan dengan fase and mata pelajaran.", "CP menjadi dasar turunan Tujuan Pembelajaran."] },
    { category: "Tujuan Pembelajaran", items: ["Tujuan memuat unsur kompetensi pengetahuan dan sikap.", "Tujuan mengintegrasikan Topik KBC.", "Tujuan mengintegrasikan Profil Lulusan.", "Tujuan menggunakan kata kerja operasional."] },
    { category: "Indikator Tujuan Pembelajaran", items: ["Indikator diturunkan langsung dari tujuan.", "Indikator mencerminkan tahapan Memahami–Mengaplikasi–Merefleksi.", "Indikator terukur and dapat diobservasi."] },
    { category: "Materi Insersi KBC", items: ["Materi insersi sesuai dengan Topik KBC.", "Integrasi nilai tidak bersifat tempelan.", "Nilai KBC terhubung dengan konsep materi inti."] },
    { category: "Praktek Pedagogik", items: ["Pemilihan Model/Metode sesuai dengan materi and tujuan pembelajaran.", "Sintaks model diterapkan konsisten dalam kegiatan inti.", "Tahapan Memahami–Mengaplikasi–Merefleksi tersusun sistematis."] },
    { category: "Lingkungan Pembelajaran", items: ["Lingkungan kelas, nyata, and digital dirancang jelas.", "Lingkungan mendukung praktek pedagogik.", "Ada relevansi antara aktivitas and setting lingkungan."] },
    { category: "Mitra Pembelajaran", items: ["Mitra belajar disebutkan secara eksplisit.", "Peran mitra jelas dalam sintaks kegiatan.", "Kolaborasi mendukung pencapaian tujuan."] },
    { category: "Pemanfaatan Digital", items: ["Digital digunakan sebagai alat eksplorasi.", "Digital mendukung dokumentasi and presentasi.", "Penggunaan digital relevan, bukan sekadar pelengkap."] },
    { category: "Kegiatan Pendahuluan", items: ["Mengandung unsur pembukaan, doa, presensi.", "Tujuan pembelajaran disampaikan eksplisit.", "Motivasi and ice breaking relevan dengan materi.", "Menciptakan suasana belajar positif."] },
    { category: "Kegiatan Inti", items: ["Ada kegiatan memahami, mengaplikasi and merefleksi yang dipetakan dengan jelas.", "Sintaks model jelas and berurutan.", "Langkah pembelajaran sesuai tagihan tujuan pembelajaran.", "Penggunaan media terlihat jelas.", "Kegiatan pembelajaran sesuai dengan lingkungan pembelajaran.", "Pemanfaatan digital terlihat jelas.", "Kemitraan pembelajaran terlihat jelas."] },
    { category: "Penutup", items: ["Ada refleksi pembelajaran.", "Ada penguatan and apresiasi.", "Ada tindak lanjut.", "Penutup dilakukan secara sistematis."] },
    { category: "Asesmen Formatif", items: ["Bentuk asesmen sesuai tujuan.", "Soal mencerminkan tahapan memahami–mengaplikasi–merefleksi.", "Ada variasi (tes tulis, observasi, produk)."] },
    { category: "Lembar Kerja", items: ["LK selaras dengan tujuan pembelajaran.", "Instruksi jelas and sistematis.", "Rubrik mendukung refleksi diri.", "Tahapan kegiatan sesuai sintaks Discovery Learning."] }
  ],
  media_siap: [
    { category: "1. Kesesuaian dengan Tujuan Pembelajaran", items: ["Media selaras dengan CP/TP/ATP yang ditetapkan.", "Media mendukung pencapaian indikator kompetensi.", "Tujuan penggunaan media dijelaskan secara eksplisit."] },
    { category: "2. Kesesuaian dengan Karakteristik Peserta Didik", items: ["Media sesuai usia and tahap perkembangan.", "Bahasa mudah dipahami siswa.", "Mempertimbangkan gaya belajar (visual, auditori, kinestetik)."] },
    { category: "3. Kesesuaian dengan Materi", items: ["Isi media akurat and relevan.", "Tidak menyimpang dari konsep inti.", "Materi disajikan secara runtut and logis."] },
    { category: "4. Aspek Visual and Estetika", items: ["Tata letak rapi and proporsional.", "Warna and font terbaca jelas.", "Gambar/ilustrasi relevan and tidak berlebihan."] },
    { category: "5. Aspek Teknis", items: ["Media dapat digunakan tanpa error.", "Navigasi jelas (jika berbasis digital).", "Audio/video jernih and sinkron."] },
    { category: "6. Kreativitas and Inovasi", items: ["Media menunjukkan unsur kebaruan.", "Menggunakan variasi pendekatan (animasi, interaktif, simulasi).", "Mengintegrasikan teknologi secara efektif."] }
  ],
  asesmen_siap: [
    { category: "Kesesuaian Asesmen dengan Tujuan Pembelajaran", items: ["Asesmen dirancang berdasarkan Tujuan Pembelajaran.", "Indikator asesmen diturunkan langsung dari indikator tujuan.", "Bentuk asesmen sesuai dengan kompetensi yang diukur (pengetahuan, keterampilan, sikap).", "Soal/tugas mengukur kemampuan berpikir sesuai level yang ditargetkan.", "Asesmen mengintegrasikan nilai karakter (Profil Lulusan and Panca Cinta)"] },
    { category: "Asesmen Diagnostik", items: ["Dirancang untuk mengetahui kesiapan awal siswa.", "Instrumen sederhana and relevan dengan materi awal.", "Hasil digunakan sebagai dasar perencanaan pembelajaran."] },
    { category: "Asesmen Formatif", items: ["Dilaksanakan selama proses pembelajaran.", "Mengukur tahapan memahami–mengaplikasi–merefleksi.", "Memberikan umpan balik langsung kepada siswa.", "Digunakan untuk perbaikan pembelajaran."] },
    { category: "Asesmen Sumatif", items: ["Mengukur ketercapaian tujuan di akhir pembelajaran.", "Soal/tugas mewakili seluruh indikator.", "Tingkat kesukaran proporsional."] },
    { category: "Kualitas Instrumen Asesmen", items: ["Soal dirumuskan dengan bahasa jelas and tidak ambigu.", "Stimulus relevan and kontekstual.", "Tidak terjadi bias bahasa, budaya, atau gender.", "Instrumen sesuai dengan karakteristik peserta didik.", "Ada variasi bentuk soal (objektif, uraian, proyek, performa)."] },
    { category: "Kelengkapan Perangkat Penilaian", items: ["Tersedia kisi-kisi asesmen.", "Tersedia rubrik penilaian (untuk uraian/proyek/kinerja).", "Skala penilaian jelas and konsisten.", "Tersedia pedoman penskoran.", "Ada instrumen penilaian diri atau penilaian teman sebaya (jika diperlukan)."] },
    { category: "Prinsip Asesmen", items: ["Asesmen bersifat valid (mengukur yang seharusnya diukur).", "Asesmen reliabel (konsisten).", "Objektif (berdasarkan kriteria jelas).", "Adil and tidak diskriminatif.", "Transparan (kriteria diketahui siswa)."] },
    { category: "Pemanfaatan Hasil Asesmen", items: ["Guru merencanakan tindak lanjut hasil asesmen.", "Ada rencana remedial bagi siswa belum tuntas.", "Ada rencana pengayaan bagi siswa tuntas.", "Hasil asesmen digunakan sebagai bahan refleksi pembelajaran."] }
  ],
  manajemen: [
    { category: "A. Kesiapan and Penataan Lingkungan Kelas", items: ["Ruang kelas bersih, rapi, and tertata.", "Tempat duduk diatur sesuai kebutuhan model pembelajaran (individual/kelompok).", "Media and alat pembelajaran telah disiapkan sebelum pembelajaran dimulai.", "Papan tulis/layar presentasi digunakan secara efektif.", "Lingkungan kelas mendukung kenyamanan and konsentrasi belajar."] },
    { category: "B. Pembukaan and Pengkondisian Awal", items: ["Guru membuka pembelajaran dengan sikap positif and ramah.", "Guru mampu menarik perhatian siswa sejak awal.", "Aturan kelas diingatkan atau ditegaskan secara proporsional.", "Guru memastikan kesiapan belajar siswa (fisik and mental).", "Suasana kelas kondusif sebelum masuk ke materi inti."] },
    { category: "C. Pengelolaan Interaksi and Partisipasi", items: ["Guru memberi kesempatan bertanya and berpendapat.", "Guru merespons siswa dengan bahasa yang santun and mendidik.", "Guru mendorong partisipasi seluruh siswa (tidak hanya siswa tertentu).", "Guru mengelola diskusi secara terarah.", "Terjadi interaksi dua arah atau multi arah."] },
    { category: "D. Pengelolaan Waktu", items: ["Kegiatan sesuai dengan alokasi waktu yang direncanakan.", "Tidak ada waktu terbuang tanpa aktivitas belajar.", "Transisi antar kegiatan berjalan lancar.", "Guru mampu mengatur tempo pembelajaran sesuai kebutuhan siswa."] },
    { category: "E. Pengelolaan Perilaku and Disiplin", items: ["Guru menegakkan aturan kelas secara konsisten.", "Penanganan siswa yang mengganggu dilakukan secara edukatif.", "Guru tidak menggunakan pendekatan yang merendahkan atau emosional.", "Guru memberi penguatan positif terhadap perilaku baik.", "Suasana kelas tetap kondusif sepanjang pembelajaran."] },
    { category: "F. Pengelolaan Sumber and Media", items: ["Media digunakan secara efektif and tidak mengganggu alur.", "Sumber belajar dimanfaatkan secara optimal.", "Penggunaan teknologi (jika ada) mendukung pembelajaran.", "Siswa terlibat dalam penggunaan media/sumber belajar."] },
    { category: "G. Menciptakan Iklim Belajar Positif", items: ["Guru menunjukkan sikap empati and menghargai siswa.", "Guru membangun hubungan yang hangat namun profesional.", "Siswa merasa aman untuk berpendapat.", "Guru menciptakan suasana inklusif and menghargai perbedaan.", "Kelas mencerminkan budaya belajar aktif and kolaboratif."] }
  ],
  media_guna: [
    { category: "Kesesuaian Media dengan Perencanaan", items: ["Media yang digunakan sesuai dengan Tujuan Pembelajaran.", "Media selaras dengan materi yang diajarkan.", "Media sesuai dengan karakteristik peserta didik.", "Media mendukung model/metode pembelajaran yang digunakan.", "Penggunaan media telah direncanakan dalam RPP/Modul Ajar."] },
    { category: "Kesiapan dan Keterampilan Teknis Guru", items: ["Media telah dipersiapkan sebelum pembelajaran dimulai.", "Guru mampu mengoperasikan media dengan lancar.", "Tidak terjadi gangguan teknis yang menghambat pembelajaran.", "Guru memiliki alternatif solusi jika terjadi kendala teknis.", "Penggunaan media tidak mengganggu alur pembelajaran."] },
    { category: "Strategi Penggunaan Media", items: ["Media digunakan pada waktu yang tepat (apersepsi, inti, refleksi).", "Guru menjelaskan tujuan penggunaan media kepada siswa.", "Media digunakan untuk memperjelas konsep, bukan sekadar pelengkap.", "Guru mengaitkan isi media dengan kehidupan nyata siswa.", "Penggunaan media terintegrated dengan aktivitas belajar."] },
    { category: "Keterlibatan Siswa dalam Penggunaan Media", items: ["Siswa aktif mengamati atau berinteraksi dengan media.", "Media memicu pertanyaan atau diskusi.", "Siswa diberi kesempatan menggunakan atau eksplorasi media.", "Media mendorong berpikir kritis/kreatif.", "Terjadi interaksi dua arah setelah penggunaan media."] },
    { category: "Efektivitas Media terhadap Proses Belajar", items: ["Media membantu siswa memahami konsep sulit/abstract.", "Media meningkatkan perhatian dan motivasi belajar.", "Media mempercepat proses pemahaman.", "Media mendukung pencapaian indikator pembelajaran.", "Hasil belajar menunjukkan dampak positif dari penggunaan media."] },
    { category: "Refleksi dan Tindak Lanjut", items: ["Guru melakukan refleksi terhadap efektivitas media.", "Guru menerima dan mempertimbangkan umpan balik siswa.", "Ada rencana perbaikan penggunaan media ke depan.", "Media direvisi jika ditemukan kekurangan."] }
  ],
  asesmen_lak: [
    { category: "Kesesuaian Pelaksanaan dengan Perencanaan", items: ["Asesmen yang dilaksanakan sesuai dengan yang tercantum dalam RPP/Modul Ajar.", "Bentuk asesmen sesuai dengan tujuan dan indikator pembelajaran.", "Waktu pelaksanaan asesmen sesuai dengan alokasi yang direncanakan.", "Instrumen yang digunakan sama dengan yang telah disiapkan.", "Pelaksanaan asesmen tidak menyimpang dari prosedur yang direncanakan."] },
    { category: "Kejelasan Instruksi dan Prosedur", items: ["Guru menjelaskan tujuan asesmen kepada siswa.", "Guru menyampaikan instruksi dengan bahasa yang jelas.", "Guru memastikan siswa memahami cara mengerjakan tugas/soal.", "Guru menjelaskan kriteria penilaian sebelum asesmen dilakukan.", "Guru memberi kesempatan bertanya sebelum asesmen dimulai."] },
    { category: "Pengelolaan Pelaksanaan Asesmen", items: ["Suasana kelas kondusif saat asesmen berlangsung.", "Guru mengawasi pelaksanaan secara aktif.", "Guru bersikap objektif and tidak diskriminatif.", "Guru menangani pelanggaran secara edukatif.", "Pelaksanaan berjalan tertib and sesuai waktu."] },
    { category: "Penerapan Prinsip Asesmen", items: ["Asesmen dilakukan secara adil untuk semua siswa.", "Tidak ada perlakuan khusus yang memengaruhi hasil.", "Guru tidak memberi petunjuk jawaban yang mengarah.", "Asesmen mencerminkan kejujuran akademik.", "Guru menjaga kerahasiaan and integritas hasil asesmen."] },
    { category: "Pelaksanaan Asesmen Formatif", items: ["Guru memberikan umpan balik langsung.", "Umpan balik bersifat membangun and spesifik.", "Guru menggunakan hasil asesmen untuk menyesuaikan pembelajaran.", "Siswa mengetahui letak kekuatan and kekurangannya."] },
    { category: "Pelaksanaan Penilaian Kinerja/Proyek (Jika Ada)", items: ["Guru menggunakan rubrik yang telah disiapkan.", "Penilaian dilakukan berdasarkan kriteria yang jelas.", "Guru mengamati proses, bukan hanya hasil akhir.", "Siswa memahami standar keberhasilan yang diharapkan."] },
    { category: "Tindak Lanjut Hasil Asesmen", items: ["Guru mengidentifikasi siswa yang belum tuntas.", "Guru merencanakan kegiatan remedial.", "Guru menyiapkan pengayaan bagi siswa yang sudah tuntas.", "Hasil asesmen digunakan sebagai bahan refleksi pembelajaran."] }
  ],
  perencanaan_ko: [
    { category: "TEMA PROJEK", items: ["Kesesuaian tema dengan kebutuhan kontekstual", "Relevansi tema dengan fase/jenjang", "Kejelasan rumusan tema", "Potensi integrasi lintas disiplin"] },
    { category: "PROFIL LULUSAN", items: ["Profil lulusan dipilih jelas", "Indikator profil diturunkan operasional", "Keterkaitan profil dengan tema", "Konsistensi profil dalam seluruh rancangan kegiatan"] },
    { category: "TOPIK KBC", items: ["Topik KBC sesuai tema", "Integrasi nilai substantif (bukan tempelan)", "Nilai KBC tampak dalam tujuan", "Nilai KBC tampak dalam aktivitas", "Nilai KBC tampak dalam refleksi"] },
    { category: "MAPEL KOLABORATIF", items: ["Mapel pendukung ditentukan jelas", "Peran tiap mapel terdeskripsi", "Kontribusi kompetensi tiap mapel terlihat", "Tidak terjadi dominasi satu mapel"] },
    { category: "TUJUAN PROJEK", items: ["Tujuan memuat pengetahuan", "Tujuan memuat keterampilan", "Tujuan memuat karakter/profil", "Tujuan selaras tema–profil–KBC"] },
    { category: "STRUKTUR PEMBELAJARAN MENDALAM (PM) - A. MEMAHAMI", items: ["Ada eksplorasi masalah kontekstual", "Ada stimulus nyata", "Ada perumusan masalah", "Ada penguatan konsep awal"] },
    { category: "STRUKTUR PEMBELAJARAN MENDALAM (PM) - B. MENGAPLIKASI", items: ["Ada kegiatan praktik/projek nyata", "Ada pengumpulan dan pengolahan data", "Ada kolaborasi aktif", "Ada proses berpikir kritis/kreatif"] },
    { category: "STRUKTUR PM - C. MEREFLEKSI", items: ["Ada verifikasi konsep and nilai", "Ada penarikan kesimpulan", "Ada refleksi karakter/profil", "Ada presentasi atau publikasi hasil"] },
    { category: "LINGKUNGAN & MITRA", items: ["Lingkungan nyata dimanfaatkan", "Lingkungan digital dimanfaatkan", "Mitra internal/eksternal direncanakan", "Peran mitra jelas dalam kegiatan"] },
    { category: "ASESMEN PROJEK", items: ["Indikator asesmen selaras tujuan", "Asesmen proses and produk", "Rubrik tersedia", "Penilaian karakter/profil terukur", "Ada penilaian refleksi diri"] },
    { category: "PRODUK/KARYA AKHIR", items: ["Produk jelas and terukur", "Produk relevan dengan tema", "Produk mencerminkan integrasi PM & KBC", "Produk memiliki nilai kebermanfaatan"] },
    { category: "TINDAK LANJUT", items: ["Ada rencana penguatan nilai", "Ada keberlanjutan projek", "Ada dokumentasi and publikasi", "Ada refleksi untuk perbaikan berikutnya"] }
  ],
  pelaksanaan_ko: [
    { category: "KETERLAKSANAAN TEMA & TUJUAN", items: ["Kegiatan berjalan sesuai tema projek", "Aktivitas mengarah pada tujuan projek", "Tujuan projek tampak dalam aktivitas siswa"] },
    { category: "IMPLEMENTASI PROFIL LULUSAN", items: ["Nilai profil lulusan tampak dalam perilaku siswa", "Siswa menunjukkan sikap sesuai profil yang dipilih", "Guru memberi penguatan terhadap profil lulusan"] },
    { category: "IMPLEMENTASI TOPIK KBC", items: ["Nilai KBC muncul dalam kegiatan nyata", "Integrasi nilai tidak bersifat tempelan", "Ada refleksi nilai pada akhir kegiatan", "Guru mengaitkan aktivitas dengan nilai KBC"] },
    { category: "PELAKSANAAN STRUKTUR PM - MEMAHAMI", items: ["Ada eksplorasi masalah kontekstual", "Siswa aktif merumuskan masalah", "Ada penguatan konsep awal"] },
    { category: "PELAKSANAAN STRUKTUR PM - MENGAPLIKASI", items: ["Siswa melakukan praktik/projek nyata", "Terjadi kolaborasi aktif antar siswa", "Siswa melakukan analisis/pemecahan masalah", "Guru berperan sebagai fasilitator"] },
    { category: "PELAKSANAAN STRUKTUR PM - MEREFLEKSI", items: ["Siswa mempresentasikan hasil projek", "Ada kegiatan refleksi proses and nilai", "Siswa mampu menarik kesimpulan", "Guru memberikan penguatan makna"] },
    { category: "PENGELOLAAN KEGIATAN", items: ["Waktu kegiatan terkelola dengan baik", "Kelompok bekerja efektif", "Suasana kegiatan kondusif", "Transisi antar tahap berjalan lancar"] },
    { category: "PEMANFAATAN LINGKUNGAN & MITRA", items: ["Lingkungan nyata dimanfaatkan", "Lingkungan digital mendukung kegiatan", "Mitra berperan aktif sesuai perencanaan"] },
    { category: "ASESMEN PROSES & PRODUK", items: ["Guru menilai proses partisipasi siswa", "Produk dinilai menggunakan rubrik", "Guru memberikan umpan balik", "Ada refleksi hasil projek"] }
  ],
  default: [{ category: "Aspek Penilaian Umum", items: ["Kesesuaian dengan modul ajar / RPP / Program Kokurikuler", "Kesiapan sarana and prasarana pendukung", "Ketepatan waktu pelaksanaan kegiatan", "Pelibatan aktif peserta didik dalam proses", "Kualitas instrumen penilaian/evaluasi"] }]
};

const SCORE_MAP = { 'SB': 4, 'B': 3, 'C': 2, 'K': 1 };


// --- Komponen Landing Page ---
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-800 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input type="text" placeholder="Cari..." className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-10 pr-4 text-sm outline-none" />
          </div>
          <div className="w-12 h-1 bg-gray-100 rounded-full"></div>
        </div>

        <header className="px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase"> SUPERVISI <span className="text-[#2D7A78]">KEREN</span> </h1>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <button onClick={() => onNavigate('Dashboard')} className="hover:text-[#2D7A78] transition-colors font-bold">Dashboard</button>
            <button onClick={() => onNavigate('Guru')} className="hover:text-[#2D7A78] transition-colors font-bold">Guru</button>
            <button onClick={() => onNavigate('Infografik')} className="hover:text-[#2D7A78] transition-colors font-bold">Infografik</button>
            <button onClick={() => onNavigate('Login')} className="bg-[#2D7A78] hover:bg-[#235e5c] text-white px-8 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 font-bold"> Login </button>
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-6">
          <section className="flex-[3] bg-gray-50 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-16">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-br from-teal-50 to-white"></div>
            </div>
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8"> Supervisi Modern,<br /> <span className="text-[#2D7A78]">Guru Termotivasi,</span><br /> Murid Bahagia </h2>
              <button onClick={() => onNavigate('Dashboard')} className="mx-auto md:mx-0 bg-[#2D7A78] text-white font-bold py-4 px-10 rounded-full shadow-xl flex items-center gap-3 transition-all group active:scale-95"> Mulai Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" /> </button>
            </div>
            <div className="relative z-10 flex-1 flex justify-center mt-12 md:mt-0">
              <div className="relative">
                <div className="w-56 h-72 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white flex items-center justify-center">
                  <img
                   src="/avatar.jpg"
                   alt="Supervisor"
                   className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#2D7A78] animate-bounce"><Bell size={20} /></div>
                <div className="absolute top-1/2 -left-6 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#2D7A78]"><FileText size={20} /></div>
              </div>
            </div>
          </section>
          <aside className="hidden md:flex flex-1 flex-col gap-6">
            <div className="flex-1 bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => onNavigate('Infografik')}>
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-[#2D7A78] mb-4 group-hover:bg-[#2D7A78] group-hover:text-white transition-all">
                <BarChart3 size={32} />
              </div>
              <h3 className="font-bold text-lg">Pantau Progress</h3>
              <p className="text-xs text-gray-500 mt-2">Lihat statistik perkembangan guru secara real-time.</p>
            </div>
            <div className="flex-1 bg-[#2D7A78] rounded-[2.5rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-teal-100">
              <h3 className="font-bold text-lg mb-4 underline decoration-white/30 underline-offset-8">Daftar Sekarang</h3>
              <button onClick={() => onNavigate('Dashboard')} className="bg-white text-[#2D7A78] font-bold px-6 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors">Hubungi Admin WA 087866174274 dengan Subjek: Mohon buatkan akun Aplikasi Supervisi Keren Nama: ... Jabatan:... Instansi: ...</button>
            </div>
          </aside>
        </main>

        <footer className="px-12 py-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-50 text-xs text-gray-400 gap-4 bg-white">
          <p className="font-medium">© 2026 Pengawas Keren Aplikasi Supervisi 1.2</p>
          <div className="flex gap-6"> <a href="#" className="hover:text-[#2D7A78]">Privasi</a> <a href="#" className="hover:text-[#2D7A78]">Syarat & Ketentuan</a> <a href="#" className="hover:text-[#2D7A78]">Hubungi Kami</a> </div>
        </footer>
      </div>
    </div>
  );
};

// --- Komponen Dashboard Utama ---
const Dashboard = ({ initialMenu = 'Dashboard', onLogout }) => {

  const [activeMenu, setActiveMenu] = useState(initialMenu);
  const [teachers, setTeachers] = useState([]);
  const [instrumentView, setInstrumentView] = useState('list');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [assessmentResults, setAssessmentResults] = useState({});
  const [laporanSubMenu, setLaporanSubMenu] = useState('selection');
  const [laporanLevel, setLaporanLevel] = useState('individual');
  const [selectedLaporanMadrasah, setSelectedLaporanMadrasah] = useState(null);
  const [selectedLaporanTeacher, setSelectedLaporanTeacher] = useState(null);
  const [schedules, setSchedules] = useState({});
  const [form, setForm] = useState({ madrasah: '', name: '', subject: '' });

  const loadTeachers = async () => {
    const { data, error } = await supabase
      .from("guru")
      .select("*")
      .eq("user_id", window.user_id)

    if (!error) {
      setTeachers(data)
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  useEffect(() => {

    const loadSchedules = async () => {

      const { data, error } = await supabase
        .from("jadwal_supervisi")
        .select("*")
        .eq("user_id", window.user_id);

      if (error) {
        console.error("Gagal ambil jadwal", error);
        return;
      }

      const formatted = {};

      data.forEach(row => {

        if (!formatted[row.guru_id]) {
          formatted[row.guru_id] = {};
        }

        formatted[row.guru_id][row.kegiatan] = {
          date: row.tanggal,
          status: row.status
        };

      });

      setSchedules(formatted);

    };

    loadSchedules();

  }, []);



useEffect(() => {
  loadAssessmentResults()
}, [])


const loadAssessmentResults = async () => {

  const { data, error } = await supabase
    .from("hasil_instrumen")
    .select("*")
    .eq("user_id", window.user_id)

  if (error) {
    console.error("Gagal ambil hasil instrumen", error)
    return
  }

  const kegiatanMap = {
    "pembelajaran": "pembelajaran",
    "media_siap": "media_siap",
    "asesmen_siap": "asesmen_siap",
    "manajemen": "manajemen",
    "media_guna": "media_guna",
    "asesmen_lak": "asesmen_lak",
    "perencanaan_ko": "perencanaan_ko",
    "pelaksanaan_ko": "pelaksanaan_ko",

    // jika database menyimpan title
    "Perencanaan Pembelajaran": "pembelajaran",
    "Persiapan Media": "media_siap",
    "Persiapan Asesmen": "asesmen_siap",
    "Manajemen Kelas": "manajemen",
    "Penggunaan Media": "media_guna",
    "Pelaksanaan Asesmen": "asesmen_lak",
    "Perencanaan Kokurikuler": "perencanaan_ko",
    "Pelaksanaan Kokurikuler": "pelaksanaan_ko"
  }

  const formatted = {}

  data.forEach(row => {

    if (!formatted[row.guru_id]) {
      formatted[row.guru_id] = {}
    }

  const kegiatanId = kegiatanMap[row.kegiatan] || row.kegiatan

    formatted[row.guru_id][row.kegiatan] = {
      scores: row.scores,
      percentage: row.percentage,
      criteria: row.criteria
    }

  })

  setAssessmentResults(formatted)

}


  // --- STATE PENGATURAN (Konfigurasi Laporan) ---
  const [config, setConfig] = useState({
    namaSupervisor: 'SUPERVISOR KEREN, S.Pd',
    nipSupervisor: '1988273645263748',
    namaAtasan: 'PENGAWAS KEREN, M.Ag',
    nipAtasan: '19750202XXXXXXXX',
    tanggalCetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    tahunAjaran: '2025/2026'
  });

  

  // State untuk Modal Detail Rincian
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // State untuk melacak folder mana yang sedang dibuka di Laporan Madrasah
  const [activeFolder, setActiveFolder] = useState(null);

  const activities = useMemo(() => [
    { id: 'pembelajaran', title: "Perencanaan Pembelajaran", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
    { id: 'media_siap', title: "Persiapan Media", icon: Video, color: "text-purple-600 bg-purple-50" },
    { id: 'asesmen_siap', title: "Persiapan Asesmen", icon: ClipboardCheck, color: "text-orange-600 bg-orange-50" },
    { id: 'manajemen', title: "Manajemen Kelas", icon: UserCheck, color: "text-teal-600 bg-teal-50" },
    { id: 'media_guna', title: "Penggunaan Media", icon: Monitor, color: "text-pink-600 bg-pink-50" },
    { id: 'asesmen_lak', title: "Pelaksanaan Asesmen", icon: PenTool, color: "text-indigo-600 bg-indigo-50" },
    { id: 'perencanaan_ko', title: "Perencanaan Kokurikuler", icon: Layers, color: "text-yellow-600 bg-yellow-50" },
    { id: 'pelaksanaan_ko', title: "Pelaksanaan Kokurikuler", icon: Activity, color: "text-green-600 bg-green-50" },
  ], []);

  const groupedTeachers = useMemo(() => {
    return teachers.reduce((acc, curr) => {
      if (!acc[curr.madrasah]) acc[curr.madrasah] = [];
      acc[curr.madrasah].push(curr);
      return acc;
    }, {});
  }, [teachers]);

  const groupedTeachersArr = Object.keys(groupedTeachers);


const reportCache = useMemo(() => {

  const cache = {}

  Object.keys(assessmentResults).forEach(guruId => {

    cache[guruId] = {}

    Object.keys(assessmentResults[guruId]).forEach(actId => {

      cache[guruId][actId] = assessmentResults[guruId][actId]

    })

  })

  return cache

}, [assessmentResults])



  // --- Fungsi CETAK (handlePrint) ---
  const handlePrint = () => {
  document.body.classList.remove("print-detail-mode")
  window.print()
}

const handlePrintDetail = () => {

  document.body.classList.add("print-detail-mode")

  window.print()

  setTimeout(()=>{
    document.body.classList.remove("print-detail-mode")
  },500)

}

  // ----FUNGSI DOWNLOAD ----

  const handleDownloadWord = () => {

    const element = document.getElementById("laporan-word");
    if (!element) {
      alert("Konten laporan belum tersedia.");
      return;
    }

    const clone = element.cloneNode(true);
   // Paksa semua tabel di dalam clone punya border 1
    clone.querySelectorAll('table').forEach(tbl => {
      tbl.setAttribute('border', '1');
      tbl.style.borderCollapse = 'collapse';
      tbl.style.width = '100%';
    });
    const content = clone.innerHTML;
    
   const html = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
      <meta charset="utf-8">
      <title>Laporan Supervisi</title>
      <style>
        body {
          font-family: "Times New Roman", serif;
          line-height: 1.5;
        }
        /* FAKTA: Word butuh border-collapse agar garis tabel tidak double/renggang */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1pt solid windowtext; /* Standar garis Word */
          padding: 5px;
          vertical-align: top;
          font-size: 11pt;
        }
        th {
          background-color: #f3f4f6; /* Kasih warna abu muda biar profesional */
          font-weight: bold;
          text-align: center;
        }
        h1, h2, h3 { text-align: center; text-transform: uppercase; }
        p { text-align: justify; }
        
        /* Agar tanda tangan tidak berantakan */
        .signature-wrapper {
          margin-top: 30px;
          width: 100%;
        }
        .sig-table {
          border: none !important;
        }
        .sig-table td {
          border: none !important;
        }
      </style>
  </head>
  <body>
      ${content}
  </body>
  </html>
  `;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Laporan_Supervisi.doc";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Fungsi untuk Membuka Detail Rincian
  const handleOpenDetail = (teacherId, activityId) => {
    const data = assessmentResults[teacherId]?.[activityId];
    const questions = ACTIVITY_QUESTIONS[activityId] || ACTIVITY_QUESTIONS.default;

    if (data && questions) {
      setDetailData({
        teacherName: teachers.find(t => t.id === teacherId)?.name,
        activityTitle: activities.find(a => a.id === activityId)?.title,
        questions: questions,
        savedScores: data.scores
      });
      setShowDetailModal(true);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!form.madrasah || !form.name || !form.subject) return;

    const { error } = await supabase.from("guru").insert({
      nama_guru: form.name,
      mapel: form.subject,
      madrasah: form.madrasah,
      user_id: window.user_id
    });

    if (error) {
      alert("Gagal menyimpan data");
      return;
    }

    await loadTeachers()

    setForm({ madrasah: '', name: '', subject: '' });
  };



  const handleDeleteTeacher = async (id) => {

    const { error } = await supabase
      .from("guru")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Gagal menghapus guru")
      return
    }

    await loadTeachers()

  };

  const handleUpdateSchedule = async (teacherId, activityId, date) => {

    if (!date) return;

    const { error } = await supabase
      .from("jadwal_supervisi")
      .upsert({
        user_id: window.user_id,
        guru_id: teacherId,
        kegiatan: activityId,
        tanggal: date,
        status: "scheduled"
      });

    if (error) {
      console.error("Gagal simpan jadwal:", error.message);
      alert("Gagal menyimpan jadwal");
      return;
    }

    setSchedules(prev => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        [activityId]: {
          date: date,
          status: "scheduled"
        }
      }
    }));

  };

  const toggleStatus = (teacherId, activityId) => {
    const current = schedules[teacherId]?.[activityId];
    if (!current?.date) return;
    setSchedules(prev => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        [activityId]: { ...current, status: current.status === 'scheduled' ? 'finished' : 'scheduled' }
      }
    }));
  };


  const handleSaveAssessment = async (e) => {
  
  console.log("TOMBOL SAVE DIKLIK")
  e.preventDefault();
  
  if (!selectedTeacher || !selectedActivity) {
    console.error("selectedTeacher atau selectedActivity masih null")
    return
  }

  const results = { ...currentAnswers };
  console.log("teacher:", selectedTeacher)
  console.log("activity:", selectedActivity)

  const scores = Object.values(results)

  const obtained = scores.reduce((acc, curr) => acc + (SCORE_MAP[curr] || 0), 0)

  const max = scores.length * 4

  const percentage = max > 0 ? (obtained / max) * 100 : 0

    let criteria = "Kurang"
    if (percentage >= 95) criteria = "Sangat Baik"
    else if (percentage >= 80) criteria = "Baik"
    else if (percentage >= 70) criteria = "Cukup"

  const report = {
    percentage: parseFloat(percentage.toFixed(2)),
    criteria
  }

  const userId = window.user_id

  // SIMPAN KE SUPABASE
  const { error } = await supabase
    .from("hasil_instrumen")
    .upsert({
      user_id: userId,
      guru_id: selectedTeacher.id,
      madrasah: selectedTeacher.madrasah,
      kegiatan: selectedActivity.id,
      scores: results,
      percentage: report.percentage,
      criteria: report.criteria,
  }, { onConflict: "guru_id,kegiatan" })
 

  if (error) {
    console.error(error)
    alert("Gagal menyimpan data")
    return
  }

  


  // STATE REACT (UI)
  setAssessmentResults(prev => ({
    ...prev,
    [selectedTeacher.id]: {
      ...(prev[selectedTeacher.id] || {}),
      [selectedActivity.id]: {
        scores: results,
        timestamp: new Date().toLocaleDateString('id-ID')
      }
    }
  }));

  setSchedules(prev => ({
    ...prev,
    [selectedTeacher.id]: {
      ...(prev[selectedTeacher.id] || {}),
      [selectedActivity.id]: {
        ...prev[selectedTeacher.id][selectedActivity.id],
        status: 'finished'
      }
    }
  }));

  setInstrumentView('list');
  setSelectedActivity(null);
  setSelectedTeacher(null);
  setCurrentAnswers({});
};

  const calculateReport = (teacherId, activityId) => {
    const data = assessmentResults[teacherId]?.[activityId];
    if (!data || !data.scores) return null;
    const scores = Object.values(data.scores);
    if (scores.length === 0) return null;
    const obtained = scores.reduce((acc, curr) => acc + (SCORE_MAP[curr] || 0), 0);
    const max = scores.length * 4;
    const percentage = max > 0 ? (obtained / max) * 100 : 0;

    // Logika Predikat Standar 
    let criteria = "Kurang";
    if (percentage >= 95) criteria = "Sangat Baik";
    else if (percentage >= 80) criteria = "Baik";
    else if (percentage >= 70) criteria = "Cukup";

    return { obtained, max, percentage: parseFloat(percentage.toFixed(2)), criteria };
  };


const getActivityStats = (activityId) => {

  let scheduled = 0
  let finished = 0

  teachers.forEach(t => {

    const schedule = schedules[t.id]?.[activityId]

    if (schedule?.status === "scheduled") scheduled++
    if (schedule?.status === "finished") finished++

  })

return { scheduled, finished }

}

  // --- Fungsi Kalkulator Statistik untuk Infografik ---
  const getStatistics = () => {
    const totalMadrasah = new Set(teachers.map(t => t.madrasah)).size;
    const totalGuru = teachers.length;

    let totalScheduled = 0;
    let totalFinished = 0;

    teachers.forEach(t => {
      const teacherSchedules = schedules[t.id] || {};
      Object.values(teacherSchedules).forEach(s => {
        if (s.status === 'scheduled') totalScheduled++;
        if (s.status === 'finished') totalFinished++;
      });
    });

    const distribution = { SB: 0, B: 0, C: 0, K: 0 };

    teachers.forEach(t => {
      activities.forEach(act => {
        const report = calculateReport(t.id, act.id)
        if (report && report.criteria) {
          if (report.criteria === "Sangat Baik") distribution.SB++;
          else if (report.criteria === "Baik") distribution.B++;
          else if (report.criteria === "Cukup") distribution.C++;
          else if (report.criteria === "Kurang") distribution.K++;
        }
      });
    });

    // --- Pengolah Data Clustered dengan Local Scaling ---
    const getClusteredData = () => {
      return activities.map(act => {
        const dist = { SB: 0, B: 0, C: 0, K: 0 };

        // Hitung guru yang benar-benar selesai di kategori ini
        teachers.forEach(t => {
          const schedule = (schedules[t.id] || {})[act.id];
          if (schedule && schedule.status === 'finished') {
            const report = calculateReport(t.id, act.id)
            if (report && report.criteria) {
              if (report.criteria === "Sangat Baik") dist.SB++;
              else if (report.criteria === "Baik") dist.B++;
              else if (report.criteria === "Cukup") dist.C++;
              else if (report.criteria === "Kurang") dist.K++;
            }
          }
        });

        // FAKTA: Gunakan angka tertinggi di cluster ini saja sebagai pembagi
        const clusterMax = Math.max(dist.SB, dist.B, dist.C, dist.K, 1);

        return {
          label: act.title,
          total: dist.SB + dist.B + dist.C + dist.K,
          data: [
            { val: dist.SB, h: (dist.SB / clusterMax) * 80, color: "bg-blue-500" },
            { val: dist.B, h: (dist.B / clusterMax) * 80, color: "bg-green-500" },
            { val: dist.C, h: (dist.C / clusterMax) * 80, color: "bg-yellow-500" },
            { val: dist.K, h: (dist.K / clusterMax) * 80, color: "bg-red-500" }
          ]
        };
      });
    };

    const clusteredData = getClusteredData();

    // Urutkan kegiatan berdasarkan jumlah SB + B (Terbaik)
    const sortedBest = [...clusteredData].sort((a, b) =>
      (b.data[0].val + b.data[1].val) - (a.data[0].val + a.data[1].val)
    );
    // Urutkan kegiatan berdasarkan jumlah C + K (Paling Rendah)
    const sortedWeak = [...clusteredData].sort((a, b) =>
      (b.data[2].val + b.data[3].val) - (a.data[2].val + a.data[3].val)
    );

    return {
      totalMadrasah, totalGuru, totalScheduled, totalFinished,
      distribution, clusteredData, sortedBest, sortedWeak
    };
  };

  
  const totalFinishedTeachersCount = useMemo(() => {
    return teachers.filter(t => assessmentResults[t.id] && Object.keys(assessmentResults[t.id]).length > 0).length;
  }, [teachers, assessmentResults]);

  const stats = useMemo(() => getStatistics(), [teachers, schedules, assessmentResults]);
const SCALE = 2;

  // Fungsi bantu untuk mencari 2 kegiatan terlemah di suatu Madrasah
  const getMadrasahWeakest = (guruDiMadrasah) => {
    const activityAverages = activities.map(act => {
      const scores = guruDiMadrasah.map(g => {
        const res = calculateReport(g.id, act.id);
        return res ? res.percentage : null;
      }).filter(s => s !== null);

      if (scores.length === 0) return { label: act.title, avg: 100 };
      return { label: act.title, avg: scores.reduce((a, b) => a + b, 0) / scores.length };
    });

    return activityAverages
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 2)
      .map(a => a.label);
  };

  // Fungsi bantu untuk mendapatkan objek rekomendasi dinamis
  const getRecommendation = (nilaiAkhir, judul) => {
    if (nilaiAkhir >= 95) {
      return {
        predikat: "Sangat Baik", color: "text-emerald-600", bg: "bg-emerald-50",
        reco: `Guru memiliki kompetensi yang sangat baik dalam ${judul} sehingga layak mendapatkan kesempatan untuk membuat best practices dan menjadi narasumber dalam kegiatan KKG/MGMP tingkat madrasah/kecamatan/kabupaten.`
      };
    } else if (nilaiAkhir >= 80) {
      return {
        predikat: "Baik", color: "text-blue-600", bg: "bg-blue-50",
        reco: `Guru memiliki kompetensi yang baik dalam ${judul} sehingga layak mendapatkan kesempatan untuk menjadi mentor teman sejawat di madrasah/sekolah.`
      };
    } else if (nilaiAkhir >= 70) {
      return {
        predikat: "Cukup", color: "text-yellow-600", bg: "bg-yellow-50",
        reco: `Guru mengalami beberapa kendala dalam ${judul} sehingga perlu disertakan dalam pengembangan keprofesian berkelanjutan yang terpantau progres pencapaiannya.`
      };
    } else {
      return {
        predikat: "Kurang", color: "text-red-600", bg: "bg-red-50",
        reco: `Guru mengalami kesulitan dalam ${judul} sehingga perlu dilakukan pendampingan individual dan disertakan dalam berbagai pelatihan berkelanjutan.`
      };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-sans text-slate-700 animate-in slide-in-from-right duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2D7A78] text-white flex flex-col shadow-xl flex-shrink-0 no-print">
        <div className="p-8">
          <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <CheckCircle size={24} /> Supervisi Keren
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Guru', icon: Users },
            { name: 'Jadwal', icon: Calendar },
            { name: 'Instrumen', icon: ClipboardList },
            { name: 'Laporan', icon: FileBarChart },
            { name: 'Infografik', icon: BarChart3 },
            { name: 'Pengaturan', icon: Settings }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveMenu(item.name);
                setInstrumentView('list');
                setLaporanSubMenu('selection');
                setActiveFolder(null);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeMenu === item.name ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-70'}`}
            >
              <item.icon size={20} /> <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-4 p-4 flex items-center gap-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors text-sm font-bold"> <LogOut size={18} /> Logout </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-200 flex-shrink-0 no-print print:hidden">
          <h2 className="text-xl font-bold">Selamat Pagi, <span className="text-[#2D7A78]">Supervisor Keren</span> <Bell className="inline text-yellow-500 ml-2 animate-pulse" size={20} /></h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Cari data..." className="bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none w-64 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-sm font-semibold text-[#2D7A78]">
              {window.user_id}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="p-8 overflow-y-auto flex-1 print:p-0 print:overflow-visible">
          {activeMenu === 'Dashboard' && (
            <div className="animate-in fade-in duration-500">
              <div className="bg-[#E9EDF5] border border-slate-300 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={120} /></div>
                <p className="text-lg text-slate-800 font-medium leading-relaxed italic relative z-10">
                  "Aplikasi ini disusun sebagai alat bantu untuk melihat progress keterlaksanaan perencanaan, pelaksanaan, dan asesmen pembelajaran, sekaligus sebagai bahan refleksi dan tindak lanjut pengembangan mutu Madrasah."
                </p>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 no-print">Ringkasan Progress Kegiatan</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
                {activities.map((act, i) => {
                  const finishedCount = teachers.filter(t => schedules[t.id]?.[act.id]?.status === 'finished').length;
                  const totalCount = teachers.length || 1;
                  const percentage = (finishedCount / totalCount) * 100;
                  return (
                    <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl flex-shrink-0 ${act.color}`}><act.icon size={20} /></div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Selesai</span>
                          <p className="text-xl font-black text-slate-800">{finishedCount}/{totalCount}</p>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800 group-hover:text-[#2D7A78] leading-tight text-sm text-left mb-4">{act.title}</h3>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${percentage}%` }} className="h-full bg-[#2D7A78] transition-all duration-1000"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeMenu === 'Guru' && (
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Manajemen Data Guru</h2>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10 no-print">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"> <Plus size={18} className="text-[#2D7A78]" /> Tambah Guru Baru </h3>
                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2"> <label className="text-xs font-bold text-slate-500">Nama Madrasah</label> <input type="text" placeholder="Contoh: MIN KEREN" value={form.madrasah} onChange={(e) => setForm({ ...form, madrasah: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D7A78] outline-none" /> </div>
                  <div className="space-y-2"> <label className="text-xs font-bold text-slate-500">Nama Guru</label> <input type="text" placeholder="Nama Lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D7A78] outline-none" /> </div>
                  <div className="space-y-2"> <label className="text-xs font-bold text-slate-500">Mata Pelajaran</label> <div className="flex gap-3"> <input type="text" placeholder="Mapel" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D7A78] outline-none" /> <button type="submit" className="bg-[#2D7A78] text-white px-6 rounded-xl font-bold hover:bg-[#235e5c] active:scale-95 transition-all"> Simpan </button> </div> </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedTeachersArr.map((madrasahName) => (
                  <div key={madrasahName} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#2D7A78]"> <Folder size={28} /> </div>
                      <div> <h4 className="font-bold text-slate-800 leading-tight">{madrasahName}</h4> <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{groupedTeachers[madrasahName].length} Guru Terdaftar</p> </div>
                    </div>
                    <div className="space-y-3">
                      {groupedTeachers[madrasahName].map((guru) => (
                        <div key={guru.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group/item hover:bg-teal-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover/item:text-[#2D7A78]"> <UserCircle size={18} /> </div>
                            <div> <p className="text-xs font-bold text-slate-700">{guru.nama_guru}</p> <p className="text-[9px] text-slate-400 font-medium">{guru.mapel}</p> </div>
                          </div>
                          <button onClick={() => handleDeleteTeacher(guru.id)} className="text-slate-200 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-1 no-print">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'Jadwal' && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Penjadwalan Supervisi</h2>
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 sticky left-0 bg-slate-50 z-10 min-w-[200px]">Nama Guru</th>
                        {activities.map(act => (
                          <th key={act.id} className="p-4 text-[9px] font-black uppercase tracking-tighter text-slate-400 text-center min-w-[140px]">
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-2 bg-white rounded-lg shadow-sm text-[#2D7A78]"><act.icon size={16} /></div>
                              <span className="leading-tight">{act.title}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(guru => (
                        <tr key={guru.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-6 sticky left-0 bg-white z-10 shadow-md">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#2D7A78] font-bold text-xs">
                                {guru.nama_guru.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{guru.nama_guru}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{guru.madrasah}</p>
                              </div>
                            </div>
                          </td>
                          {activities.map(act => {
                            const sched = schedules[guru.id]?.[act.id];
                            const isScheduled = sched?.status === 'scheduled';
                            const isFinished = sched?.status === 'finished';
                            return (
                              <td key={act.id} className="p-2 text-center group">
                                <div className={`relative p-3 rounded-2xl transition-all border-2 border-transparent flex flex-col items-center gap-2 ${isFinished ? 'bg-teal-500 text-white border-teal-600 shadow-lg scale-105' : isScheduled ? 'bg-yellow-400 text-white border-yellow-500 shadow-md' : 'hover:border-slate-200 bg-slate-50/30'}`}>
                                  <input
                                    type="date"
                                    value={sched?.date || ''}
                                    onChange={(e) => handleUpdateSchedule(guru.id, act.id, e.target.value)}
                                    className="text-[10px] bg-transparent outline-none cursor-pointer font-bold w-full text-center no-print"
                                  />
                                  <span className="hidden print:block text-[10px] font-bold">{sched?.date || "-"}</span>
                                  {sched?.date && (
                                    <button
                                      onClick={() => toggleStatus(guru.id, act.id)}
                                      className={`mt-1 p-1.5 rounded-full transition-colors no-print ${isFinished ? 'bg-white/20 hover:bg-white/40' : 'bg-black/10 hover:bg-black/20'}`}
                                      title={isFinished ? "Batalkan Selesai" : "Tandai Selesai"}
                                    >
                                      {isFinished ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                                    </button>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Instrumen' && (
            <div className="animate-in fade-in duration-500 no-print">
              {instrumentView === 'list' && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">Instrumen Supervisi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((act, i) => {
                      const scheduledCount = teachers.filter(t => schedules[t.id]?.[act.id]?.status === 'scheduled').length;
                      const finishedCount = teachers.filter(t => schedules[t.id]?.[act.id]?.status === 'finished').length;
                      return (
                        <button key={i} onClick={() => { setSelectedActivity(act); setInstrumentView('pick-teacher'); }} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all text-left group">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${act.color}`}> <act.icon size={24} /> </div>
                          <h3 className="font-bold text-sm text-slate-800 mb-3 leading-tight min-h-[40px]">{act.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg"> <Clock size={10} /> {scheduledCount} Terjadwal </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#2D7A78] bg-teal-50 px-2 py-1 rounded-lg"> <CheckCircle2 size={10} /> {finishedCount} Selesai </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {instrumentView === 'pick-teacher' && (
                <div className="max-w-4xl mx-auto">
                  <button onClick={() => setInstrumentView('list')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2D7A78] mb-6 transition-colors"> <ChevronLeft size={18} /> Kembali </button>
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800 mb-10">{selectedActivity.title}</h2>
                    <div className="mb-12">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"> <Clock size={14} /> Pilih Guru yang Terjadwal </h3>
                      <div className="space-y-4">
                        {teachers.filter(t => schedules[t.id]?.[selectedActivity.id]?.status === 'scheduled').length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                            <AlertCircle className="mx-auto text-slate-200 mb-2" size={32} />
                            <p className="text-slate-400 italic text-sm">Tidak ada guru yang terjadwal untuk kegiatan ini.</p>
                            <button onClick={() => setActiveMenu('Jadwal')} className="mt-4 text-[#2D7A78] text-xs font-bold underline">Buat Jadwal Baru</button>
                          </div>
                        ) : (
                          teachers.filter(t => schedules[t.id]?.[selectedActivity.id]?.status === 'scheduled').map(t => (
                            <button key={t.id} onClick={() => { setSelectedTeacher(t); setInstrumentView('form'); }} className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-[#2D7A78] group rounded-3xl transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#2D7A78] font-black group-hover:scale-95 transition-transform"> {t.nama_guru.substring(0, 2).toUpperCase()} </div>
                                <div className="text-left">
                                  <p className="font-bold text-slate-800 group-hover:text-white transition-colors text-sm">{t.nama_guru}</p>
                                  <p className="text-[10px] text-slate-400 group-hover:text-white/60 transition-colors">{t.madrasah} • {schedules[t.id][selectedActivity.id].date}</p>
                                </div>
                              </div>
                              <ChevronRight className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {instrumentView === 'form' && (
                <div className="max-w-4xl mx-auto">
                  <button onClick={() => setInstrumentView('pick-teacher')} className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-sm"> <ChevronLeft size={18} /> Ganti Guru </button>
                  <form onSubmit={handleSaveAssessment} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{selectedActivity.title}</span>
                        <h2 className="text-2xl font-black text-slate-800">{selectedTeacher.nama_guru}</h2>
                      </div>
                      <div className="bg-teal-50 px-4 py-2 rounded-xl text-[#2D7A78] font-bold text-xs">{selectedTeacher.madrasah}</div>
                    </div>

                    <div className="space-y-12">
                      {(ACTIVITY_QUESTIONS[selectedActivity.id] || ACTIVITY_QUESTIONS.default).map((category, catIdx) => (
                        <div key={catIdx} className="space-y-6">
                          <h3 className="text-base font-black text-[#2D7A78] bg-teal-50 px-4 py-2 rounded-xl flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#2D7A78] rounded-full"></div> {category.category}
                          </h3>
                          <div className="space-y-8 pl-4">
                            {category.items.map((q, item_i) => (
                              <div key={item_i} className="space-y-4">
                                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">{q}</p>
                                <div className="grid grid-cols-4 gap-4 max-w-sm">
                                  {['SB', 'B', 'C', 'K'].map(scale => (
                                    <label key={scale} className="cursor-pointer group">
                                      <input
                                        type="radio"
                                        name={`q_${catIdx}_${item_i}`}
                                        className="peer hidden"
                                        required
                                        onChange={() => setCurrentAnswers(prev => ({ ...prev, [`${catIdx}_${item_i}`]: scale }))}
                                      />
                                      <div className="p-3 text-center rounded-2xl bg-slate-50 text-slate-400 font-black text-xs peer-checked:bg-[#2D7A78] peer-checked:text-white transition-all group-hover:bg-slate-100 border border-transparent peer-checked:border-[#2D7A78]"> {scale} </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="w-full mt-16 bg-[#2D7A78] text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-[#235e5c] transition-all active:scale-95"> <Save size={18} /> Simpan Penilaian & Selesaikan </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeMenu === 'Infografik' && (
            <div className="animate-in fade-in duration-500 space-y-8 pb-20">
              {/* HEADER */}
              <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                  <h2 className="text-3xl font-black text-slate-800">Visualisasi Performa</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Penjaminan Mutu Madrasah TA {config.tahunAjaran}</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-3xl text-[#2D7A78]"> <PieChart size={40} /> </div>
              </div>

              {/* INFOGRAFIK 1: STATISTIK RINGKAS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Madrasah", val: stats.totalMadrasah, icon: <Home size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Total Guru", val: stats.totalGuru, icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "Terjadwal", val: stats.totalScheduled, icon: <Clock size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Selesai", val: stats.totalFinished, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{item.label}</p>
                      <p className="text-2xl font-black text-slate-800">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INFOGRAFIK 2: CLUSTERED COLUMN CHART (DENGAN SCALING LOCAL MAX & MIN-HEIGHT) */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 overflow-hidden">
                <div className="text-center">
                  <h3 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Sebaran Predikat per Kategori</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                    Clustered Analysis Tahun Ajaran {config.tahunAjaran}
                  </p>
                </div>

                <div className="overflow-x-auto pb-6">
                  <div className="min-w-[800px] h-[350px] flex items-end border-b-2 border-slate-100 px-4">
                   <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200"></div>
                    {stats.clusteredData.map((group, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center px-2 group min-w-[120px]">
                        {/* Cluster Area */}
                        <div className="flex items-end justify-center gap-1 w-full h-full pb-2 relative">
                          {group.data.map((bar, j) => (
                            <div
                              key={j}
                              style={{
                                height: bar.val > 0 
                                  ? `${Math.min(bar.val * 50, 250)}px` 
                                  : '2px',
                                width: '1.5rem',
                                transition: 'height 0.5s ease-out'
                              }}
                              className={`w-4 ${bar.color} rounded-t-[2px] shadow-sm transition-all duration-700 hover:brightness-110 relative group/bar`}
                            >
                              {/* ANGKA DI ATAS BATANG */}
                              {bar.val > 0 && (
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[14px] font-black text-slate-700 animate-in fade-in duration-1000">
                                  {bar.val}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Label Kategori */}
                        <div className="mt-4 flex flex-col items-center px-1">
                          <span className="text-[10px] font-bold uppercase text-slate-600 text-center leading-tight h-10 line-clamp-2">
                            {group.label}
                          </span>
                          <span className="text-[9px] font-medium text-[#2D7A78] mt-2 uppercase tracking-wider">
                            Total: {group.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><span>SB</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>B</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div><span>C</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div><span>K</span></div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Laporan' && (
            <div className="animate-in fade-in duration-500">
              {laporanSubMenu === 'selection' && (
                <div className="space-y-8 no-print">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">Pusat Laporan Supervisi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <button onClick={() => { setLaporanSubMenu('individual'); setLaporanLevel('individual'); }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all text-left group">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><UserCircle size={32} /></div>
                      <h3 className="font-bold text-lg mb-2">Laporan Individual</h3>
                      <p className="text-xs text-slate-400">Analisis mendalam performa guru secara mandiri per kegiatan.</p>
                    </button>
                    <button onClick={() => { setLaporanSubMenu('madrasah'); setLaporanLevel('madrasah'); setSelectedLaporanMadrasah(null); setActiveFolder(null); }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all text-left group">
                      <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform"><Folder size={32} /></div>
                      <h3 className="font-bold text-lg mb-2">Laporan Madrasah/Sekolah</h3>
                      <p className="text-xs text-slate-400">Rekapitulasi capaian mutu seluruh guru dalam satu lembaga.</p>
                    </button>
                    <button onClick={() => setLaporanSubMenu('lengkap')} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all text-left group">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform"><FileSearch size={32} /></div>
                      <h3 className="font-bold text-lg mb-2">Laporan Naratif</h3>
                      <p className="text-xs text-slate-400">Dokumen laporan resmi lengkap dengan Kata Pengantar & Penutup.</p>
                    </button>
                  </div>
                </div>
              )}

              {laporanSubMenu === 'individual' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <button onClick={() => setLaporanSubMenu('selection')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2D7A78] mb-6 transition-colors no-print"> <ChevronLeft size={18} /> Kembali </button>
                  <h2 className="text-2xl font-black text-slate-800 no-print">Pilih Guru</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
                    {teachers.map(t => (
                      <button key={t.id} onClick={() => setSelectedLaporanTeacher(t)} className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${selectedLaporanTeacher?.id === t.id ? 'border-[#2D7A78] bg-teal-50' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">{t.nama_guru}</p>
                          <p className="text-[10px] text-slate-400">{t.madrasah} • {t.subject}</p>
                        </div>
                        <ChevronRight size={16} className={selectedLaporanTeacher?.id === t.id ? 'text-[#2D7A78]' : 'text-slate-200'} />
                      </button>
                    ))}
                  </div>

                  {selectedLaporanTeacher && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 animate-in slide-in-from-bottom duration-500 print:p-0 print:border-none print-rapor">
                      <div className="print:mx-0">
                       <div className="border-b pb-6 print:pb-4">

                      {/* HEADER LAPORAN */}
                      <div className="text-center space-y-1">
                        <h2 className="text-2xl font-black tracking-wide print:text-xl">
                          RAPOR SUPERVISI AKADEMIK
                        </h2>

                        <h3 className="text-lg font-bold text-slate-700 print:text-base">
                         {activities.find(a => a.id === activeFolder)?.title || "Perencanaan Pembelajaran"}
                        </h3>
                      </div>

                      {/* IDENTITAS GURU */}
                      <div className="mt-6 grid grid-cols-2 gap-y-2 text-sm print:text-sm">

                       <div className="font-semibold">Nama Guru</div>
                       <div>: {selectedLaporanTeacher?.nama_guru || "-"}</div>

                       <div className="font-semibold">Madrasah</div>
                       <div>: {selectedLaporanTeacher?.madrasah || "-"}</div>

                       <div className="font-semibold">Mata Pelajaran</div>
                       <div>: {selectedLaporanTeacher?.subject || selectedLaporanTeacher?.mapel || "-"}</div>

                       <div className="font-semibold">Tanggal Supervisi</div>
                       <div>: {new Date().toLocaleDateString("id-ID")}</div>

                      </div>

                      {/* TOMBOL CETAK */}
                      <div className="flex justify-end mt-6 no-print">
                       <button
                         onClick={handlePrint}
                         className="bg-[#2D7A78] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#235e5c] transition-           all"
    >
                         <Printer size={14} /> Cetak Rapor
                       </button>
                      </div>

                    </div>
                    
                      
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 print:grid-cols-1">
                        {activities.map(act => {
                          const res = reportCache[selectedLaporanTeacher.id]?.[act.id];
                          return (
                            <button
                              key={act.id}
                              onClick={() => res && handleOpenDetail(selectedLaporanTeacher.id, act.id)}
                              className={`p-6 rounded-2xl flex justify-between items-center transition-all text-left w-full ${res ? 'bg-white border border-slate-200 hover:shadow-md cursor-pointer' : 'bg-slate-50 opacity-90 cursor-not-allowed'}`}
                            >
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">{act.title}</p>
                                <p className="font-bold text-slate-800">{res ? res.criteria : "Belum Dinilai"}</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <p className="text-2xl font-black text-[#2D7A78]">{res ? `${res.percentage}%` : "-"}</p>
                                {res && <ChevronRight size={14} className="text-slate-300 no-print" />}
                              </div>
                            </button>
                           );
                          
                        })}
                      </div>
                    </div>
                   </div>
                  )}
                </div>
              )}

              {laporanSubMenu === 'madrasah' && (
                <div className="max-w-5xl mx-auto space-y-8">
                  {!selectedLaporanMadrasah ? (
                    <>
                      <button onClick={() => setLaporanSubMenu('selection')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2D7A78] mb-6 transition-colors no-print"> <ChevronLeft size={18} /> Kembali </button>
                      <h2 className="text-2xl font-black text-slate-800">Pilih Madrasah</h2>
                      <div className="flex flex-wrap gap-4">
                        {groupedTeachersArr.map(m => (
                          <button key={m} onClick={() => setSelectedLaporanMadrasah(m)} className="px-8 py-5 rounded-3xl font-bold border-2 border-slate-100 bg-white hover:border-[#2D7A78] hover:bg-teal-50 transition-all flex flex-col gap-1 items-start">
                            <span className="text-slate-800 text-lg">{m}</span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">{groupedTeachers[m].length} Guru</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        if (activeFolder) setActiveFolder(null);
                        else setSelectedLaporanMadrasah(null);
                      }} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2D7A78] mb-6 transition-colors no-print">
                        <ChevronLeft size={18} /> {activeFolder ? 'Kembali ke Daftar Folder' : 'Kembali ke Pilih Madrasah'}
                      </button>

                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black text-slate-800">Rekapitulasi: {selectedLaporanMadrasah}</h2>
                        {activeFolder && (
                          <button onClick={handlePrint} className="bg-[#2D7A78] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 no-print"><Printer size={14} /> Cetak Grafik</button>
                        )}
                      </div>

                      {!activeFolder ? (
                        /* --- VIEW 1: DAFTAR FOLDER SUPERVISI --- */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activities.map((act) => (
                            <button key={act.id} onClick={() => setActiveFolder(act)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                              <div className={`w-14 h-14 rounded-2xl ${act.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <act.icon size={28} />
                              </div>
                              <div className="text-left">
                                <h3 className="font-black text-slate-800 text-sm">{act.title}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Buka Folder</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* --- VIEW 2: DIAGRAM BATANG PER GURU --- */
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 animate-in zoom-in-95 duration-300 print:p-0 print:border-none">
                          <div className="flex justify-between items-center mb-10">
                            <div>
                              <span className="text-[10px] font-black uppercase text-[#2D7A78] tracking-widest">Detail Performa Madrasah</span>
                              <h3 className="text-xl font-black text-slate-800">{activeFolder.title}</h3>
                            </div>
                          </div>

                          <div className="space-y-10">
                            {groupedTeachers[selectedLaporanMadrasah].map(guru => {
                              const res = calculateReport(guru.id, activeFolder.id);
                              const score = res ? res.percentage : 0;

                              return (
                                <div key={guru.id} className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="font-black text-slate-800 text-sm">{guru.nama_guru}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase">{res ? res.criteria : "Belum Dinilai"}</p>
                                    </div>
                                    <p className="text-xl font-black text-[#2D7A78]">{score}%</p>
                                  </div>

                                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                      className={`h-full transition-all duration-1000 ease-out rounded-full ${score >= 95 ? 'bg-emerald-500' :
                                          score >= 80 ? 'bg-blue-500' :
                                            score >= 70 ? 'bg-yellow-500' :
                                              score > 0 ? 'bg-red-500' : 'bg-slate-200'
                                        }`}
                                      style={{ width: `${score}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {laporanSubMenu === 'lengkap' && (
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-12 space-y-20 animate-in zoom-in duration-500 font-serif leading-relaxed text-slate-900 print:p-0 print:shadow-none print:border-none print:rounded-none">
                  <div className="flex justify-between items-center no-print mb-10 pb-4 border-b">
                    <button onClick={() => setLaporanSubMenu('selection')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2D7A78] transition-colors font-sans"> <ChevronLeft size={18} /> Kembali </button>
                    <button onClick={handlePrint} className="bg-[#2D7A78] text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-100 font-sans"> <Printer size={16} /> Cetak Dokumen </button>
                    <button onClick={handleDownloadWord} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-teal-100 font-sans"> 📄 Download Word  </button>
                  </div>

                <div id="laporan-word">

                    {/* HALAMAN JUDUL */}
                    <div className="min-h-[270mm] flex flex-col items-center text-center pt-10 pb-10 page break after">
                      <div className="space-y-8">
                        <h1 className="text-4xl font-black uppercase tracking-widest leading-tight">LAPORAN KEGIATAN<br />SUPERVISI AKADEMIK</h1>
                        <p className="text-xl font-bold uppercase italic font-sans">Berbasis Pembelajaran Mendalam (PM) dan Kurikulum Berbasis Cinta (KBC)</p>
                        <p className="text-2xl font-black mt-8">Tahun Ajaran {config.tahunAjaran}</p>
                      </div>
                      <div className="flex items-center justify-center mt-24 mb-24">
                        <img src="logo.png" alt="Logo" className="w-60 h-60 opacity-90" />
                      </div>
                      <div className="space-y-4 font-sans">
                        <p className="text-lg font-bold">Disusun oleh:</p>
                        <div className="space-y-4">
                          <p className="text-xl font-black uppercase underline underline-offset-8 decoration-2">{config.namaSupervisor}</p>
                          <p className="font-bold text-slate-600">NIP. {config.nipSupervisor}</p>
                        </div>
                      </div>
                      <p className="font-black uppercase tracking-widest text-lg mt-4 font-sans">Kementerian Agama Republik Indonesia<br />2026</p>
                    </div>

                    {/* LEMBAR PENGESAHAN */}
                    <div className="min-h-[270mm] flex flex-col pt-10 pb-10 page-break-after">
                      <div className="text-center space-y-2 mb-2">
                        <h2 className="text-2xl font-black uppercase underline underline-offset-8 decoration-2">LEMBAR PENGESAHAN</h2>
                        <p className="text-lg font-black pt-6 uppercase">LAPORAN KEGIATAN SUPERVISI AKADEMIK</p>
                        <p className="text-lg font-black uppercase">TAHUN AJARAN {config.tahunAjaran}</p>
                      </div>

                      <div className="space-y-2 text-justify text-sm leading-relaxed max-w-2xl mx-auto">
                        <p className="indent-12">
                          Laporan Kegiatan Supervisi Akademik Berbasis Pembelajaran Mendalam (PM) dan Kurikulum Berbasis Cinta (KBC) ini telah dilaksanakan dan disusun sebagai bagian dari upaya peningkatan mutu pembelajaran di ____________________________.
                        </p>
                        <p className="indent-12">
                          Laporan ini telah diperiksa dan disahkan untuk digunakan sebagai dokumen resmi satuan pendidikan pada hari …………………….tanggal …………………………tahun 2026.
                        </p>
                      </div>

                      <div className="w-full max-w-2xl mx-auto mt-24">
                        <div className="flex justify-start text-sm mb-16">
                          <div className="space-y-1">
                            <p>Ditetapkan di : ____________________________</p>
                            <p>Pada tanggal : ____________________________</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="text-center space-y-24">
                            <p className="font">Yang Mengesahkan,<br />Kepala</p>
                            <div className="space-y-1">
                              <p className="font-black uppercase underline underline-offset-4">{config.namaAtasan}</p>
                              <p className="text-xs">NIP. {config.nipAtasan}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KATA PENGANTAR */}
                    <div className="min-h-[270mm] flex flex-col pt-10 pb-10">
                      <div className="text-center mb-12">
                        <h2 className="text-2xl font-black uppercase">KATA PENGANTAR</h2>
                      </div>

                      <div className="space-y-2 text-justify text-sm leading-relaxed max-w-2xl mx-auto">
                        <p className="indent-12">Puji syukur ke hadirat Allah Swt. atas rahmat dan karunia-Nya sehingga Laporan Kegiatan Supervisi Akademik Tahun Ajaran {config.tahunAjaran} ini dapat disusun dengan baik. Laporan ini merupakan dokumentasi resmi pelaksanaan supervisi akademik sebagai bagian dari sistem penjaminan mutu internal madrasah dalam rangka meningkatkan kualitas proses dan hasil pembelajaran.</p>

                        <p className="indent-12">Supervisi akademik dilaksanakan sebagai upaya pembinaan profesional guru yang berkelanjutan serta penguatan implementasi Pembelajaran Mendalam (PM) dan Kurikulum Berbasis Cinta (KBC). Melalui kegiatan supervisi yang meliputi penelaahan perangkat pembelajaran, observasi kelas, wawancara, dan refleksi bersama, diperoleh gambaran komprehensif mengenai praktik pembelajaran yang telah berjalan, kekuatan yang perlu dipertahankan, serta aspek yang memerlukan pengembangan lebih lanjut.</p>

                        <p className="indent-12">Laporan ini disusun tidak semata-mata sebagai bentuk pemenuhan administrasi, melainkan sebagai instrumen refleksi akademik dan dasar perumusan tindak lanjut pembinaan. Hasil supervisi diharapkan dapat menjadi pijakan dalam memperkuat kualitas perencanaan, pelaksanaan, dan evaluasi pembelajaran sehingga proses pendidikan di madrasah semakin bermakna, kontekstual, dan berorientasi pada pengembangan karakter serta kompetensi peserta didik secara utuh.</p>

                        <p className="indent-12">Kami menyampaikan apresiasi kepada seluruh guru yang telah menunjukkan komitmen dan keterbukaan dalam proses supervisi ini. Semangat kolaborasi dan kemauan untuk terus belajar menjadi modal penting dalam membangun budaya mutu di lingkungan madrasah. Ucapan terima kasih juga disampaikan kepada semua pihak yang telah mendukung terselenggaranya kegiatan supervisi ini dengan baik.</p>

                        <p className="indent-12">Akhirnya, kami berharap laporan ini dapat memberikan kontribusi nyata bagi peningkatan profesionalisme guru serta mutu pembelajaran di madrasah. Semoga upaya yang dilakukan senantiasa mendapatkan ridha dan bimbingan Allah Swt., serta membawa keberkahan bagi seluruh civitas akademika.</p>
                      </div>

                      <div className="flex flex-col items-end mt-16 pr-10">
                        <div className="text-center space-y-20 text-sm">
                          <p>__________________, {config.tanggalCetak}</p>
                          <p className="font-bold uppercase">Penulis,</p>
                        </div>
                      </div>
                    </div>


                    {/* RINGKASAN EKSEKUTIF */}
                    <div className="min-h-[270mm] flex flex-col pt-10 pb-10 page-break-after">
                      <div className="text-center mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">RINGKASAN EKSEKUTIF</h2>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">(EXECUTIVE SUMMARY)</p>
                      </div>

                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <p className="indent-12">
                          Laporan Kegiatan Supervisi Akademik Tahun Ajaran {config.tahunAjaran} ini disusun sebagai bagian dari sistem penjaminan mutu internal madrasah dalam rangka memastikan keterlaksanaan pembelajaran yang selaras dengan prinsip Pembelajaran Mendalam (PM) dan Kurikulum Berbasis Cinta (KBC). Supervisi dilaksanakan melalui observasi kelas, studi dokumen perangkat pembelajaran, wawancara, serta refleksi bersama guna memperoleh gambaran komprehensif mengenai kualitas perencanaan dan pelaksanaan pembelajaran.
                        </p>

                        <p className="indent-12">
                          Secara umum, hasil supervisi menunjukkan bahwa proses pembelajaran di madrasah telah berjalan dengan baik dan menunjukkan komitmen guru dalam meningkatkan profesionalisme. Perangkat pembelajaran telah tersusun secara sistematis, dan pelaksanaan pembelajaran relatif kondusif serta berorientasi pada peserta didik. Implementasi struktur <strong>Memahami–Mengaplikasi–Merefleksi</strong> mulai terlihat dalam desain kegiatan pembelajaran, demikian pula integrasi nilai-nilai Kurikulum Berbasis Cinta dalam pembiasaan sikap dan penguatan karakter.
                        </p>

                        <p className="indent-12">
                          Namun demikian, analisis mendalam menunjukkan bahwa kedalaman implementasi Pembelajaran Mendalam masih perlu penguatan, terutama pada tahap aplikasi kontekstual dan refleksi bermakna. Asesmen formatif dan pemberian umpan balik yang spesifik juga belum sepenuhnya optimal sebagai bagian dari siklus perbaikan pembelajaran. Integrasi nilai KBC pada beberapa kelas masih bersifat implisit dan belum sepenuhnya terstruktur dalam pengalaman belajar yang sadar and reflektif.
                        </p>

                        <p className="indent-12">
                          Faktor pendukung utama dalam implementasi pembelajaran adalah komitmen guru, dukungan kebijakan madrasah, serta budaya kolaborasi yang mulai tumbuh. Sementara itu, faktor penghambat yang teridentifikasi meliputi variasi pemahaman konseptual tentang Pembelajaran Mendalam, keterbatasan waktu, serta kebutuhan penguatan kompetensi dalam asesmen reflektif dan kontekstual.
                        </p>

                        <p className="indent-12">
                          Sebagai tindak lanjut, direncanakan program pembinaan terstruktur berupa workshop penguatan Pembelajaran Mendalam, pelatihan integrasi Kurikulum Berbasis Cinta, pendampingan penyusunan asesmen formatif, serta pengembangan praktik refleksi kolektif melalui lesson study. Monitoring dan evaluasi berkala akan dilakukan untuk memastikan implementasi rekomendasi berjalan secara konsisten dan berkelanjutan.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 mt-8">
                          <p className="italic text-center">
                            "Dengan pelaksanaan supervisi yang sistematis dan tindak lanjut yang terarah, madrasah diharapkan mampu memperkuat budaya mutu dan menghadirkan pembelajaran yang tidak hanya memenuhi standar administratif, tetapi juga bermakna, transformatif, dan berorientasi pada pembentukan peserta didik yang berilmu, berkarakter, dan berdaya saing."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BAB I - PENDAHULUAN */}
                    <div className="min-h-[270mm] pt-10 pb-20">
                      <div className="text-center"> <h2 className="text-2xl font-black uppercase">BAB I<br />PENDAHULUAN</h2> </div>
                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <h3 className="font-bold text-base">A. Latar Belakang</h3>
                        <p className="indent-12">
                          Supervisi akademik merupakan salah satu instrumen strategis dalam menjamin mutu proses pembelajaran di satuan pendidikan. Dalam konteks peningkatan kualitas pendidikan, supervisi tidak lagi dipahami sebagai kegiatan penilaian semata, melainkan sebagai proses pembinaan profesional yang sistematis, terencana, dan berkelanjutan. Melalui supervisi akademik, kepala madrasah atau pengawas dapat memastikan bahwa perencanaan, pelaksanaan, dan evaluasi pembelajaran berjalan sesuai dengan standar yang telah ditetapkan.
                        </p>

                        <p className="indent-12">
                          Di era transformasi pendidikan yang menuntut pembelajaran lebih bermakna, kontekstual, dan bercenter pada peserta didik, supervisi akademik menjadi semakin urgen. Perubahan kurikulum, perkembangan teknologi, serta tuntutan penguatan karakter menuntut guru untuk terus beradaptasi dan meningkatkan kompetensinya. Oleh karena itu, supervisi akademik diperlukan sebagai mekanisme kontrol mutu sekaligus pendampingan profesional agar proses pembelajaran tetap relevan, adaptif, dan berkualitas.
                        </p>

                        <p className="indent-12">
                          Dengan demikian, urgensi supervisi akademik tidak hanya terletak pada fungsi pengawasan administratif, tetapi juga pada perannya sebagai instrumen strategis dalam mendorong perbaikan mutu pembelajaran secara menyeluruh. Kesadaran akan pentingnya supervisi tersebut membawa perhatian pada aspek yang lebih substantif, yaitu bagaimana proses pembelajaran dirancang, dilaksanakan, dan dievaluasi secara profesional. Pada titik inilah supervisi menjadi bagian integral dari upaya sistematis peningkatan mutu pembelajaran di satuan pendidikan.
                        </p>

                        <p className="indent-12">
                          Peningkatan mutu pembelajaran merupakan tanggung jawab bersama seluruh unsur satuan pendidikan, dengan guru sebagai aktor utama dalam proses tersebut. Mutu pembelajaran tidak hanya diukur dari ketercapaian hasil belajar peserta didik, tetapi juga dari kualitas perencanaan, strategi pembelajaran, penggunaan media, serta pelaksanaan asesmen yang autentik dan berkelanjutan. Supervisi akademik menjadi landasan penting untuk memastikan bahwa seluruh komponen tersebut dirancang dan diimplementasikan secara optimal sesuai standar yang berlaku.
                        </p>

                        <p className="indent-12">
                          Upaya peningkatan mutu pembelajaran tidak dapat dilakukan secara asumtif atau berdasarkan persepsi semata. Diperlukan mekanisme yang mampu memberikan gambaran faktual mengenai kondisi riil di kelas, baik dari sisi perencanaan maupun pelaksanaannya. Dalam hal ini, supervisi akademik berperan sebagai instrumen evaluatif yang menyediakan data objektif untuk pengambilan keputusan yang tepat, terukur, dan berbasis bukti.
                        </p>

                        <p className="indent-12">
                          Temuan yang diperoleh melalui supervisi tidak berhenti pada identifikasi kelebihan dan kekurangan semata, tetapi harus ditindaklanjuti dalam bentuk pembinaan yang berkelanjutan. Proses ini menempatkan guru sebagai subjek utama pengembangan mutu pendidikan. Dengan kata lain, kualitas pembelajaran sangat bergantung pada kapasitas profesional guru yang terus berkembang seiring dengan dinamika perubahan kebijakan dan kebutuhan peserta didik.
                        </p>

                        <p className="indent-12">
                          Guru sebagai tenaga profesional dituntut untuk senantiasa mengembangkan kompetensi pedagogik, profesional, sosial, dan kepribadian. Tuntutan ini sejalan dengan perkembangan ilmu pengetahuan dan teknologi serta kompleksitas karakteristik peserta didik yang semakin beragam. Dalam praktiknya, tidak semua guru memiliki kesempatan yang sama untuk melakukan refleksi dan pengembangan diri secara mandiri, sehingga diperlukan mekanisme pembinaan yang terstruktur dan berkesinambungan melalui supervisi akademik.
                        </p>

                        <p className="indent-12">
                          Pengembangan profesional guru memerlukan pendekatan yang terarah, sistematis, and kolaboratif. Tanpa pendampingan yang memadai, upaya peningkatan kompetensi seringkali berjalan tidak optimal dan tidak berkelanjutan. Dalam konteks inilah supervisi akademik hadir sebagai sarana pembinaan yang tidak hanya bersifat evaluatif, tetapi juga edukatif dan suportif.
                        </p>

                        <p className="indent-12">
                          Dengan pendekatan yang humanis dan berbasis kemitraan, supervisi akademik diharapkan mampu membangun budaya belajar di kalangan guru, mendorong refleksi berkelanjutan, serta menumbuhkan komitmen kolektif dalam meningkatkan kualitas pembelajaran. Pada akhirnya, supervisi akademik menjadi bagian penting dari sistem penjaminan mutu internal satuan pendidikan dalam mewujudkan pembelajaran yang efektif, bermakna, dan berorientasi pada pengembangan karakter serta kompetensi peserta didik secara utuh.
                        </p>
                      </div>

                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <h3 className="font-bold text-base">B. Tujuan Supervisi</h3>
                        <p className="indent-12">
                          Supervisi akademik ini bertujuan untuk memastikan bahwa proses perencanaan dan pelaksanaan pembelajaran di madrasah berjalan secara sistematis, bermakna, dan selaras dengan prinsip Pembelajaran Mendalam (PM) serta Kurikulum Berbasis Cinta (KBC). Supervisi tidak hanya menilai aspek administratif, tetapi juga mengkaji sejauh mana pembelajaran dirancang untuk mendorong peserta didik memahami konsep secara utuh, mengaplikasikan pengetahuan dalam konteks nyata, serta merefleksikan nilai dan makna pembelajaran dalam kehidupan sehari-hari.
                        </p>

                        <p className="text-sm font-medium">Secara khusus, tujuan supervisi akademik adalah sebagai berikut:</p>

                        <ul className="list-disc pl-12 space-y-2 text-[13px]">
                          <li className="leading-relaxed">
                            <strong>Menilai kualitas perencanaan dan pelaksanaan pembelajaran</strong> agar selaras dengan struktur Pembelajaran Mendalam (Memahami–Mengaplikasi–Merefleksi) serta terintegrasi dengan nilai-nilai KBC secara substantif.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Meningkatkan profesionalisme guru</strong> melalui pembinaan yang berkelanjutan, sehingga guru mampu merancang dan melaksanakan pembelajaran yang tidak hanya berorientasi pada capaian kognitif, tetapi juga pada penguatan karakter, profil lulusan, dan nilai-nilai cinta dalam proses pendidikan.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Mengidentifikasi kekuatan dan area pengembangan</strong> dalam praktik pembelajaran, baik dari aspek pedagogik, integrasi nilai KBC, pengelolaan kelas, penggunaan media, maupun pelaksanaan asesmen, sebagai dasar perumusan tindak lanjut pembinaan yang terarah dan berkelanjutan.
                          </li>
                        </ul>

                        <p className="indent-12">
                          Dengan tujuan tersebut, supervisi akademik diharapkan menjadi sarana reflektif dan transformatif dalam membangun budaya pembelajaran yang mendalam, humanis, dan berorientasi pada pembentukan insan yang berilmu, berkarakter, dan berdaya saing.
                        </p>
                      </div>


                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <h3 className="font-bold text-base">C. Dasar Hukum</h3>
                        <p className="indent-12">
                          Pelaksanaan supervisi akademik pada madrasah dilaksanakan berdasarkan ketentuan peraturan perundang-undangan dan kebijakan pendidikan terbaru yang berlaku pada tahun pelajaran berjalan. Regulasi tersebut menjadi landasan normatif sekaligus operasional dalam menjamin mutu proses pembelajaran, implementasi kurikulum, serta penguatan karakter berbasis nilai keislaman dan kebangsaan. Adapun dasar hukum pelaksanaan supervisi akademik adalah sebagai berikut:
                        </p>

                        <ol className="list-decimal pl-12 space-y-2 text-[13px]">
                          <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</li>
                          <li>Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.</li>
                          <li>Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan.</li>
                          <li>Permendikdasmen Nomor 12 Tahun 2025 tentang Standar Isi.</li>
                          <li>Permendikdasmen Nomor 13 Tahun 2025 tentang Perubahan Kurikulum.</li>
                          <li>Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran Mata Pelajaran Umum.</li>
                          <li>Keputusan Menteri Agama (KMA) Nomor 1503 Tahun 2024 tentang Pedoman Kurikulum Madrasah.</li>
                          <li>Surat Keputusan Direktur Jenderal Pendidikan Islam Nomor 6077 Tahun 2025 tentang Panduan Kurikulum Berbasis Cinta.</li>
                          <li>Surat Keputusan Direktur Jenderal Pendidikan Islam Nomor 9941 Tahun 2025 tentang Capaian Pembelajaran PAI dan Bahasa Arab.</li>
                          <li>Program Kerja Madrasah Tahun Ajaran {config.tahunAjaran}, khususnya pada bidang peningkatan mutu pembelajaran dan supervisi akademik.</li>
                        </ol>

                        <p className="indent-12">
                          Dengan berlandaskan regulasi tersebut, supervisi akademik dilaksanakan secara sistematis sebagai bagian dari sistem penjaminan mutu internal madrasah guna memastikan keterlaksanaan kurikulum, pembelajaran mendalam, serta penguatan karakter berbasis Kurikulum Berbasis Cinta.
                        </p>
                      </div>

                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <h3 className="font-bold text-base">D. Ruang Lingkup Supervisi</h3>
                        <p className="indent-12">
                          Ruang lingkup supervisi akademik dalam laporan ini mencakup seluruh komponen yang berkaitan dengan perencanaan dan pelaksanaan pembelajaran di madrasah, baik pada kegiatan intrakurikuler maupun kokurikuler. Supervisi dilakukan secara komprehensif untuk memastikan bahwa setiap tahapan pembelajaran telah dirancang dan diimplementasikan sesuai dengan prinsip Pembelajaran Mendalam (Memahami–Mengaplikasi–Merefleksi) serta terintegrasi secara substantif dengan nilai-nilai Kurikulum Berbasis Cinta (KBC).
                        </p>

                        <p className="text-sm font-medium">Secara lebih rinci, ruang lingkup supervisi meliputi aspek-aspek berikut:</p>

                        <ul className="list-disc pl-12 space-y-2 text-[13px]">
                          <li className="leading-relaxed">
                            <strong>Perencanaan Pembelajaran:</strong> Penelaahan terhadap kelengkapan dan kualitas perangkat pembelajaran, keselarasan tujuan dengan capaian pembelajaran, integrasi struktur Pembelajaran Mendalam, serta penguatan nilai KBC dalam perumusan tujuan dan kegiatan.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Perencanaan Media Pembelajaran:</strong> Mencakup kesesuaian media dengan tujuan pembelajaran, karakteristik peserta didik, serta efektivitas media dalam mendukung pemahaman konsep dan internalisasi nilai.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Perencanaan Asesmen:</strong> Meliputi keselarasan instrumen asesmen dengan tujuan pembelajaran, keberadaan rubrik penilaian, serta integrasi penilaian proses dan produk yang mendukung refleksi dan penguatan karakter.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Pengelolaan Kelas:</strong> Kemampuan guru menciptakan suasana belajar yang kondusif, partisipatif, dan kolaboratif sehingga mendukung keterlibatan aktif peserta didik dalam setiap tahapan pembelajaran.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Penggunaan Media Pembelajaran:</strong> Menilai efektivitas pemanfaatan media dalam memperjelas konsep, meningkatkan motivasi belajar, serta mendorong interaksi bermakna antara guru dan peserta didik.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Pelaksanaan Asesmen:</strong> Mencakup keterlaksanaan asesmen formatif dan sumatif, objektivitas penilaian, pemberian umpan balik, serta tindak lanjut hasil asesmen untuk perbaikan pembelajaran.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Perencanaan Kokurikuler:</strong> Penelaahan terhadap desain kegiatan kokurikuler berbasis tema, profil lulusan, dan Topik KBC yang terstruktur dalam sintaks Pembelajaran Mendalam.
                          </li>
                          <li className="leading-relaxed">
                            <strong>Pelaksanaan Kokurikuler:</strong> Menilai keterlaksanaan kegiatan kokurikuler secara kontekstual, kolaboratif, dan reflektif, serta kontribusinya dalam penguatan karakter dan kompetensi peserta didik.
                          </li>
                        </ul>

                        <p className="indent-12">
                          Dengan ruang lingkup yang menyeluruh tersebut, supervisi akademik diharapkan mampu memberikan gambaran utuh mengenai kualitas proses pembelajaran dan penguatan karakter di madrasah, sekaligus menjadi dasar dalam merumuskan langkah-langkah pembinaan yang sistematis dan berkelanjutan.
                        </p>
                      </div>

                    </div>   {/* penutup BAB I */}

                    {/* BAB II - PELAKSANAAN SUPERVISI */}
                    <div className="min-h-[270mm] space-y-2 pt-10 page-break-before font-serif leading-relaxed text-slate-900">
                      <div className="text-center mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-widest">BAB II<br />PELAKSANAAN SUPERVISI</h2>
                      </div>

                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <p className="indent-12">
                          Pelaksanaan supervisi menjadi ruh dari semua tahapan kegiatan supervisi. Kegiatan ini membutuhkan persiapan matang, terutama mental, integritas, dan konsistensi. Supervisi tidak dapat dilakukan secara formalitas atau sekadar memenuhi kewajiban administratif, melainkan harus dilandasi komitmen profesional untuk membangun mutu pembelajaran secara berkelanjutan. Oleh karena itu, setiap tahapan pelaksanaan supervisi dirancang secara sistematis, mulai dari penjadwalan, penyiapan instrumen, hingga koordinasi dengan guru yang akan disupervisi, agar proses berjalan objektif, terarah, dan berorientasi pada pembinaan.
                        </p>
                        <p className="indent-12">
                          Dalam praktiknya, pelaksanaan supervisi dilakukan melalui pendekatan yang humanis dan kolaboratif, sehingga guru tidak merasa diawasi, tetapi didampingi. Supervisor menjaga integritas dengan melakukan pengamatan berbasis data dan instrumen yang telah ditetapkan, serta menghindari penilaian subjektif. Konsistensi dalam menerapkan standar dan indikator menjadi kunci agar hasil supervisi memiliki validitas dan reliabilitas. Dengan pelaksanaan yang terencana dan berprinsip tersebut, supervisi akademik diharapkan mampu menghasilkan temuan yang akurat sekaligus mendorong refleksi dan perbaikan nyata dalam praktik pembelajaran.
                        </p>

                        {/* A. WAKTU DAN TEMPAT */}
                        <div className="space-y-2 pt-6">
                          <h3 className="font-bold text-base">A. Waktu dan Tempat</h3>
                          <p className="indent-12">Pelaksanaan supervisi akademik dilaksanakan sesuai dengan jadwal yang telah ditetapkan dalam program kerja madrasah pada Tahun Ajaran {config.tahunAjaran}. Kegiatan supervisi dilakukan secara terencana dan terjadwal, dengan mempertimbangkan kalender akademik serta distribusi beban tugas guru agar tidak mengganggu kelancaran proses pembelajaran. Jadwal pelaksanaan supervisi mencakup tahap penelaahan perangkat pembelajaran, observasi pelaksanaan pembelajaran di kelas, serta kegiatan refleksi dan tindak lanjut bersama guru yang disupervisi.</p>
                          <p className="indent-12">Kegiatan supervisi dilaksanakan di lingkungan madrasah, meliputi ruang kelas sebagai lokasi observasi pembelajaran, ruang guru untuk penelaahan perangkat pembelajaran, serta ruang pertemuan untuk kegiatan refleksi dan pembinaan. Untuk kegiatan kokurikuler, supervisi dilaksanakan pada lokasi kegiatan sesuai dengan tema dan desain projek, baik di lingkungan madrasah maupun di luar madrasah apabila kegiatan tersebut memanfaatkan lingkungan nyata sebagai sumber belajar.</p>
                          <p className="indent-12">Supervisi dilaksanakan sesuai dengan jadwal yang tertera dalam aplikasi hasil kesepakatan antara supervisor dengan guru. Penentuan kesepakatan ini dilakukan secara tatap muka maupun secara daring.</p>
                        </div>

                        {/* B. SASARAN SUPERVISI */}
                        <div className="space-y-2 pt-6">
                          <h3 className="font-bold text-base">B. Sasaran Supervisi</h3>
                          <p className="indent-12">Sasaran supervisi akademik adalah seluruh guru yang melaksanakan kegiatan pembelajaran pada Tahun Ajaran {config.tahunAjaran}. Jumlah guru yang menjadi objek supervisi diperioritaskan ASN dan SERGUR, yang terdiri atas guru mata pelajaran umum dan/atau guru mata pelajaran keagamaan sesuai dengan struktur kurikulum.</p>
                          <p className="indent-12">Supervisi dilaksanakan pada berbagai mata pelajaran dan jenjang/fase sesuai dengan pembagian tugas mengajar yang berlaku. Dengan cakupan tersebut, supervisi diharapkan mampu memberikan gambaran menyeluruh mengenai kualitas pembelajaran pada setiap jenjang/fase, sekaligus memastikan bahwa implementasi Pembelajaran Mendalam dan Kurikulum Berbasis Cinta berjalan secara konsisten di seluruh kelas.</p>
                        </div>

                        {/* C. TEKNIK SUPERVISI */}
                        <div className="space-y-2 pt-6">
                          <h3 className="font-bold text-base">C. Teknik Supervisi</h3>
                          <p className="indent-12">Pelaksanaan supervisi akademik dalam kegiatan ini menggunakan pendekatan kolaboratif dan reflektif dengan memadukan beberapa teknik supervisi. Penggunaan berbagai teknik ini dimaksudkan untuk memperoleh gambaran yang komprehensif mengenai kualitas perencanaan, pelaksanaan, dan evaluasi pembelajaran, sekaligus memastikan keterlaksanaan prinsip Pembelajaran Mendalam dan integrasi nilai Kurikulum Berbasis Cinta. Adapun teknik supervisi yang digunakan adalah sebagai berikut:</p>

                          <div className="pl-6 space-y-2">
                            <p><strong>1. Observasi Kelas</strong><br />Observasi kelas dilakukan untuk memperoleh data langsung mengenai pelaksanaan pembelajaran di kelas. Melalui teknik ini, supervisor mengamati secara sistematis aktivitas guru dan peserta didik selama proses pembelajaran berlangsung. Observasi difokuskan pada keterlaksanaan perencanaan pembelajaran, penerapan struktur Pembelajaran Mendalam (Memahami–Mengaplikasi–Merefleksi), pengelolaan kelas, penggunaan media, serta pelaksanaan asesmen. Dalam observasi kelas, supervisor menggunakan instrumen yang telah disusun sebelumnya sebagai panduan pengamatan. Aspek yang diamati meliputi keterlibatan aktif peserta didik, kualitas interaksi guru–siswa, efektivitas strategi pembelajaran, serta penguatan nilai karakter sesuai Topik KBC. Hasil observasi dicatat secara objektif dan sistematis sebagai bahan analisis dan refleksi bersama guru.</p>

                            <p><strong>2. Studi Dokumen (Perencanaan Pembelajaran, Asesmen, dan Kokurikuler)</strong><br />Studi dokumen dilakukan untuk menelaah kualitas perencanaan pembelajaran yang disusun oleh guru. Dokumen yang dikaji meliputi Perencanaan Pembelajaran, perangkat asesmen, rubrik penilaian, serta dokumen pendukung lainnya. Penelaahan ini bertujuan untuk memastikan keselarasan antara capaian pembelajaran, tujuan, kegiatan, asesmen, dan integrasi nilai karakter. Dalam konteks Pembelajaran Mendalam, studi dokumen difokuskan pada keberadaan dan konsistensi struktur Memahami–Mengaplikasi–Merefleksi dalam desain pembelajaran. Sementara itu, dalam konteks KBC, penelaahan diarahkan pada integrasi nilai cinta (cinta Allah dan Rasul, cinta ilmu, cinta lingkungan, cinta diri dan sesama, serta cinta tanah air) secara substantif, bukan sekadar simbolik. Hasil studi dokumen menjadi dasar untuk menilai kesiapan guru sebelum observasi pelaksanaan pembelajaran.</p>

                            <p><strong>3. Wawancara</strong><br />Wawancara dilakukan sebagai teknik pendalaman informasi terhadap guru yang disupervisi. Melalui wawancara, supervisor menggali pemahaman guru mengenai tujuan pembelajaran, strategi yang digunakan, pertimbangan pemilihan metode dan media, serta kendala yang dihadapi dalam implementasi pembelajaran. Wawancara juga dimaksudkan untuk mengetahui sejauh mana guru memahami dan menginternalisasi prinsip Pembelajaran Mendalam serta nilai-nilai KBC dalam praktiknya. Teknik ini dilaksanakan secara dialogis dan humanis, sehingga guru merasa nyaman untuk menyampaikan pengalaman, refleksi, serta kebutuhan pengembangan profesionalnya. Informasi yang diperoleh dari wawancara melengkapi data hasil observasi dan studi dokumen.</p>

                            <p><strong>4. Refleksi Bersama</strong><br />Refleksi bersama merupakan tahap penting dalam supervisi akademik yang bersifat kolaboratif. Setelah observasi dan analisis dokumen dilakukan, supervisor dan guru melaksanakan diskusi reflektif untuk membahas temuan supervisi. Diskusi ini bertujuan untuk mengidentifikasi praktik baik yang perlu dipertahankan serta area yang perlu ditingkatkan. Dalam sesi refleksi, guru diberi kesempatan untuk menyampaikan pengalaman, tantangan, serta pembelajaran yang diperoleh selama proses pembelajaran. Supervisor kemudian memberikan umpan balik yang konstruktif dan berbasis data, serta merumuskan tindak lanjut secara bersama-sama. Pendekatan reflektif ini sejalan dengan prinsip Pembelajaran Mendalam yang menekankan proses memahami dan merefleksi, sekaligus memperkuat budaya belajar profesional di lingkungan madrasah.</p>
                          </div>
                          <p className="indent-12">Dengan memadukan keempat teknik tersebut, supervisi akademik dilaksanakan secara menyeluruh, objektif, dan berorientasi pada pembinaan. Teknik-teknik ini saling melengkapi sehingga hasil supervisi tidak hanya menggambarkan kondisi faktual pembelajaran, tetapi juga menjadi dasar perbaikan yang sistematis dan berkelanjutan.</p>
                        </div>

                        {/* D. INSTRUMEN YANG DIGUNAKAN */}
                        <div className="space-y-2 pt-6">
                          <h3 className="font-bold text-base">D. Instrumen yang Digunakan</h3>
                          <p className="indent-12">Dalam pelaksanaan supervisi akademik ini, digunakan seperangkat instrumen yang dirancang secara sistematis untuk menilai seluruh aspek perencanaan dan pelaksanaan pembelajaran, baik pada kegiatan intrakurikuler maupun kokurikuler. Instrumen tersebut disusun berdasarkan standar proses pendidikan, prinsip Pembelajaran Mendalam (Memahami–Mengaplikasi–Merefleksi), serta integrasi nilai-nilai Kurikulum Berbasis Cinta (KBC).</p>
                          <p className="indent-12">Penggunaan instrumen ini bertujuan untuk memastikan bahwa supervisi dilakukan secara objektif, terukur, dan berbasis data. Setiap instrumen memuat indikator yang jelas dan operasional sehingga hasil supervisi dapat dianalisis secara komprehensif serta dijadikan dasar tindak lanjut pembinaan. Adapun instrumen yang digunakan meliputi:</p>

                          <div className="pl-6 space-y-2 text-[13px]">
                            <p><strong>1. Instrumen Perencanaan Pembelajaran</strong><br />Instrumen ini digunakan untuk menilai kualitas perangkat pembelajaran yang disusun guru, meliputi kelengkapan identitas, keselarasan capaian pembelajaran dengan tujuan, perumusan indikator, serta konsistensi antara tujuan, kegiatan, dan asesmen. Penilaian juga difokuskan pada integrasi struktur Pembelajaran Mendalam dalam langkah-langkah pembelajaran serta penguatan nilai karakter sesuai Topik KBC.</p>
                            <p><strong>2. Instrumen Perencanaan Media Pembelajaran</strong><br />Instrumen ini digunakan untuk menelaah kesesuaian media yang dirancang dengan tujuan dan karakteristik peserta didik. Aspek yang dinilai mencakup relevansi media terhadap materi, efektivitas dalam membantu pemahaman konsep, serta potensi media dalam mendukung pembelajaran yang aktif dan bermakna.</p>
                            <p><strong>3. Instrumen Perencanaan Asesmen</strong><br />Instrumen ini digunakan untuk menilai keselarasan antara tujuan pembelajaran dan bentuk asesmen yang dirancang. Penilaian meliputi keberadaan kisi-kisi, rubrik penilaian, asesmen proses dan produk, serta integrasi penilaian sikap dan karakter. Dalam konteks Pembelajaran Mendalam, asesmen diarahkan untuk mengukur kemampuan memahami, mengaplikasikan, dan merefleksikan pembelajaran.</p>
                            <p><strong>4. Instrumen Pengelolaan Kelas</strong><br />Instrumen ini digunakan saat observasi untuk menilai kemampuan guru dalam menciptakan suasana belajar yang kondusif, partisipatif, dan kolaboratif. Aspek yang diamati meliputi manajemen waktu, pengaturan kelompok, penguatan disiplin positif, serta keterlibatan aktif peserta didik dalam setiap tahap pembelajaran.</p>
                            <p><strong>5. Instrumen Penggunaan Media Pembelajaran</strong><br />Instrumen ini digunakan untuk menilai efektivitas pemanfaatan media dalam proses pembelajaran. Fokus penilaian mencakup ketepatan waktu penggunaan media, kemampuan guru mengoperasikan media, serta dampaknya terhadap motivasi dan pemahaman peserta didik.</p>
                            <p><strong>6. Instrumen Pelaksanaan Asesmen</strong><br />Instrumen ini digunakan untuk menilai keterlaksanaan asesmen di kelas, termasuk objektivitas penilaian, pemberian umpan balik, serta tindak lanjut hasil asesmen. Penilaian juga mencakup sejauh mana asesmen mendorong refleksi peserta didik dan penguatan nilai karakter.</p>
                            <p><strong>7. Instrumen Perencanaan Kokurikuler</strong><br />Instrumen ini digunakan untuk menelaah desain kegiatan kokurikuler berbasis tema, profil lulusan, dan Topik KBC. Penilaian difokuskan pada keselarasan tujuan projek, struktur Pembelajaran Mendalam, kolaborasi lintas mata pelajaran, serta kebermaknaan produk atau karya akhir.</p>
                            <p><strong>8. Instrumen Pelaksanaan Kokurikuler</strong><br />Instrumen ini digunakan untuk menilai keterlaksanaan kegiatan kokurikuler secara kontekstual dan kolaboratif. Aspek yang diamati meliputi partisipasi peserta didik, implementasi struktur Memahami–Mengaplikasi–Merefleksi, penguatan nilai KBC, serta asesmen proses dan produk kegiatan.</p>
                          </div>

                          <p className="indent-12">Dengan penggunaan instrumen yang komprehensif tersebut, supervisi akademik dilaksanakan secara terstruktur dan menyeluruh. Instrumen ini tidak hanya berfungsi sebagai alat evaluasi, tetapi juga sebagai panduan pembinaan profesional yang berorientasi pada peningkatan mutu pembelajaran dan penguatan karakter peserta didik secara berkelanjutan.</p>
                        </div>
                      </div>
                    </div>

                    {/* BAB III - ANALISIS STRATEGIS */}
                    <div className="min-h-[270mm] space-y-8 pt-20 page-break-before">
                      <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-widest">BAB III<br />HASIL DAN ANALISIS STRATEGIS</h2>
                      </div>


                      {/* A. CAPAIAN UMUM */}
                      <div className="space-y-2 pt-6">
                        <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                          <h3 className="font-bold text-base">A. Capaian Umum</h3>
                          <p className="text-sm text-justify indent-12 leading-relaxed">
                            Berdasarkan data yang dihimpun selama periode supervisi, berikut adalah ringkasan rekapitulasi capaian performa guru di seluruh kategori penilaian:
                          </p>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden font-sans print:border-slate-300">
                          <table className="w-full text-left text-[10px]">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="p-3 border-b">Kategori Penilaian</th>
                                <th className="p-3 border-b text-center">SB</th>
                                <th className="p-3 border-b text-center">B</th>
                                <th className="p-3 border-b text-center">C</th>
                                <th className="p-3 border-b text-center">K</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getStatistics().clusteredData.map((d, i) => (
                                <tr key={i} className="border-b last:border-0">
                                  <td className="p-3 font-medium">{d.label}</td>
                                  {d.data.map((b, j) => (
                                    <td key={j} className="p-3 text-center">{b.val}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* NARASI ANALISIS OTOMATIS */}
                        <div className="space-y-6">
                          <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                            <p className="text-sm text-justify indent-12 leading-relaxed">
                              Berdasarkan hasil supervisi terhadap <strong>{totalFinishedTeachersCount} guru</strong> yang telah menyelesaikan siklus observasi, diperoleh gambaran objektif mengenai peta mutu instruksional.
                              Capaian tertinggi (kombinasi predikat Sangat Baik dan Baik) terlihat dominan pada kegiatan
                              <strong> {getStatistics().sortedBest[0]?.label}</strong>, diikuti oleh
                              <strong> {getStatistics().sortedBest[1]?.label}</strong>, dan
                              <strong> {getStatistics().sortedBest[2]?.label}</strong>.
                              Hal ini menunjukkan bahwa kompetensi guru pada ketiga aspek tersebut telah melampaui standar minimal yang ditetapkan.
                            </p>

                            <p className="text-sm text-justify indent-12 leading-relaxed">
                              Namun demikian, analisis data juga mengidentifikasi beberapa area yang memerlukan intervensi mendesak.
                              Tingkat capaian Cukup (C) dan Kurang (K) yang signifikan ditemukan pada kegiatan
                              <strong> {getStatistics().sortedWeak[0]?.label}</strong> sebagai prioritas utama perbaikan, disusul oleh
                              <strong> {getStatistics().sortedWeak[1]?.label}</strong> dan
                              <strong> {getStatistics().sortedWeak[2]?.label}</strong>.
                            </p>
                          </div>

                          <div className="bg-teal-50 p-6 rounded-2xl border-l-4 border-[#2D7A78] mt-6">
                            <h3 className="text-xs font-black text-[#2D7A78] uppercase mb-2 tracking-widest">Kesimpulan & Rekomendasi Strategis</h3>
                            <p className="text-sm italic text-slate-700 leading-relaxed">
                              Fokus pendampingan berkelanjutan (coaching) akan diprioritaskan pada tiga aspek dengan skor terendah tersebut guna memastikan kualitas pembelajaran yang merata.
                              Secara simultan, praktik baik (best practice) dari tiga aspek dengan skor tertinggi akan didiseminasikan melalui kegiatan KKG/MGMP untuk mempertahankan dan meningkatkan standar mutu lembaga.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* B. CAPAIAN KEGIATAN SUPERVISI (VERSI DATA RIIL) */}
                      <div className="space-y-2 pt-12">
                        <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                          <div className="text">
                            <h3 className="font-bold text-base">B. Capaian Setiap Kategori Supervisi</h3>
                          </div>
                        </div>

                        <div className="space-y-10">
                          {activities.map((act, index) => {
                            const realScores = teachers
                              .map(t => calculateReport(t.id, act.id))
                              .filter(res => res !== null);

                            if (realScores.length === 0) return null;

                            const percentages = realScores.map(s => s.percentage);
                            const totalGuru = realScores.length;
                            const maxScore = Math.max(...percentages);
                            const minScore = Math.min(...percentages);
                            const avgScore = (percentages.reduce((a, b) => a + b, 0) / totalGuru).toFixed(2);

                            const getCriteriaLabel = (p) => {
                              if (p >= 95) return "Sangat Baik";
                              if (p >= 80) return "Baik";
                              if (p >= 70) return "Cukup";
                              return "Kurang";
                            };

                            return (
                              <div key={index} className="break-inside-avoid space-y-4 border-b border-slate-50 pb-8 last:border-0">
                                <h3 className="text-sm font-bold bg-slate-100 p-2 rounded-lg border-l-4 border-slate-800">
                                  {index + 1}. {act.title}
                                </h3>

                                <div className="grid grid-cols-4 gap-4 mb-4 font-sans">
                                  <div className="text-center p-2 border rounded-xl">
                                    <p className="text-[8px] text-slate-500 uppercase">Total Guru</p>
                                    <p className="text-lg font-black">{totalGuru}</p>
                                  </div>
                                  <div className="text-center p-2 border rounded-xl bg-teal-50">
                                    <p className="text-[8px] text-teal-600 uppercase">Skor Tertinggi</p>
                                    <p className="text-lg font-black">{maxScore}%</p>
                                    <p className="text-[7px] font-bold uppercase">{getCriteriaLabel(maxScore)}</p>
                                  </div>
                                  <div className="text-center p-2 border rounded-xl bg-orange-50">
                                    <p className="text-[8px] text-orange-600 uppercase">Skor Terendah</p>
                                    <p className="text-lg font-black">{minScore}%</p>
                                    <p className="text-[7px] font-bold uppercase">{getCriteriaLabel(minScore)}</p>
                                  </div>
                                  <div className="text-center p-2 border rounded-xl bg-blue-50">
                                    <p className="text-[8px] text-blue-600 uppercase">Rata-rata Skor</p>
                                    <p className="text-lg font-black">{avgScore}%</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400">Analisis Akar Masalah:</h4>
                                    <p className="text-[11px] text-justify leading-relaxed text-slate-700">
                                      {avgScore >= 80 ?
                                        "Capaian tinggi pada aspek ini disebabkan oleh pemahaman metodologis yang matang dan ketersediaan perangkat ajar yang memadai. Guru telah mampu menginternalisasi indikator ke dalam praktik kelas secara organik." :
                                        avgScore >= 70 ?
                                          "Capaian pada level menengah ini mengindikasikan bahwa secara administratif guru telah memenuhi syarat, namun secara substansi masih memerlukan sinkronisasi antara perencanaan dan eksekusi di lapangan." :
                                          "Capaian rendah ini kemungkinan dipicu oleh kurangnya pelatihan spesifik terkait instrumen ini, serta beban administrasi yang menghambat guru untuk melakukan eksplorasi kreatif dalam pembelajaran."
                                      }
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase text-teal-600">Tindakan Berkelanjutan:</h4>
                                    <ul className="text-[11px] list-disc list-inside space-y-1 text-slate-700">
                                      {avgScore >= 80 ?
                                        (<>
                                          <li>Jadikan model praktik baik (benchmarking) bagi guru lain.</li>
                                          <li>Dokumentasikan sebagai portofolio digital lembaga.</li>
                                        </>) :
                                        (<>
                                          <li>Workshop klinis pendampingan sebaya (Peer Coaching).</li>
                                          <li>Evaluasi rutin pada rapat koordinasi mingguan.</li>
                                          <li>Penyediaan template/modul contoh yang lebih aplikatif.</li>
                                        </>)
                                      }
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* C. CAPAIAN SETIAP MADRASAH/SEKOLAH */}
                      <div className="space-y-16 pt-12">
                        <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                          <div className="text">
                            <h3 className="font-bold text-base">C. Capaian Setiap Madrasah/Sekolah</h3>
                          </div>
                        </div>

                        {groupedTeachersArr.map((madrasahName, mIdx) => {
                          const guruDiMadrasah = teachers.filter(g =>
                            g.madrasah === madrasahName &&
                            assessmentResults[g.id] &&
                            Object.keys(assessmentResults[g.id]).length > 0
                          );

                          if (guruDiMadrasah.length === 0) return null;

                          return (
                            <div key={mIdx} className="break-inside-avoid space-y-6">
                              <h3 className="text-lg font-black text-white bg-[#2D7A78] px-6 py-2 rounded-r-full inline-block font-sans">
                                {mIdx + 1}. {madrasahName}
                              </h3>

                              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm font-sans">
                                <table className="w-full text-[8px] text-left border-collapse">
                                  <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                      <th className="p-3 border-r w-8">No</th>
                                      <th className="p-3 border-r w-32">Nama Guru</th>
                                      {activities.map((k, i) => (
                                        <th key={i} className="p-2 border-r text-center leading-tight">{k.title}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {guruDiMadrasah.map((guru, gIdx) => (
                                      <tr key={gIdx} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="p-3 border-r text-center">{gIdx + 1}</td>
                                        <td className="p-3 border-r font-bold uppercase">{guru.nama_guru}</td>
                                        {activities.map((act, aIdx) => {
                                          const res = calculateReport(guru.id, act.id);
                                          if (!res) return <td key={aIdx} className="p-2 border-r text-center text-slate-300">-</td>;
                                          const nilai = res.percentage;
                                          return (
                                            <td key={aIdx} className="p-2 border-r text-center font-medium">
                                              <span className={nilai >= 95 ? 'text-emerald-600' : nilai >= 81 ? 'text-blue-600' : nilai >= 71 ? 'text-orange-600' : 'text-rose-600'}>
                                                {nilai >= 95 ? 'SB' : nilai >= 81 ? 'B' : nilai >= 71 ? 'C' : 'K'}
                                              </span>
                                              <div className="text-[6px] text-slate-400 font-normal">{nilai}%</div>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 font-sans">
                                <div className="text-xs text-justify leading-relaxed">
                                  Dari tabel rekapitulasi di atas, capaian hasil supervisi pada <strong>{madrasahName}</strong> adalah sebagai berikut:
                                  <ul className="mt-2 list-disc pl-5 space-y-1 italic text-slate-600">
                                    {activities.map((keg, kIdx) => {
                                      const statsKeg = guruDiMadrasah.map(g => calculateReport(g.id, keg.id)).filter(r => r !== null);
                                      if (statsKeg.length === 0) return null;

                                      const countSB = statsKeg.filter(r => r.percentage >= 95).length;
                                      const countB = statsKeg.filter(r => r.percentage >= 80 && r.percentage < 95).length;
                                      const countC = statsKeg.filter(r => r.percentage >= 70 && r.percentage < 80).length;
                                      const countK = statsKeg.filter(r => r.percentage < 70).length;

                                      return (
                                        <li key={kIdx}>
                                          Pada kegiatan <strong>{keg.title}</strong>: Sangat Baik ({countSB} orang), Baik ({countB} orang), Cukup ({countC} orang), Kurang ({countK} orang).
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>

                                <div className="mt-4 p-4 bg-[#2D7A78]/10 rounded-xl border-l-4 border-[#2D7A78]">
                                  <p className="text-xs font-medium text-slate-800">
                                    Sehingga pada <strong>{madrasahName}</strong> secara umum dibutuhkan pendampingan intensif pada kegiatan
                                    <span className="font-black text-[#2D7A78]"> {getMadrasahWeakest(guruDiMadrasah)[0]}</span> dan
                                    <span className="font-black text-[#2D7A78]"> {getMadrasahWeakest(guruDiMadrasah)[1]}</span>.
                                  </p>
                                </div>
                              </div>

                              <div className="print:page-break-after-always"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>


                    {/* BAB PENUTUP */}
                    <div className="min-h-[280mm] space-y-8 pt-20 page-break-before page-break-after">
                      <div className="text-center"> <h2 className="text-2xl font-black uppercase">BAB IV<br />PENUTUP</h2> </div>
                      <div className="space-y-2 text-justify text-[13px] leading-relaxed max-w-2xl mx-auto text-slate-800">
                        <p className="indent-12">
                          Sebagai penutup, laporan supervisi akademik ini bukanlah sekadar dokumentasi administratif tahunan, melainkan refleksi kolektif atas upaya madrasah dalam merawat nyala api kualitas pendidikan. Setiap data yang tersaji dan temuan yang terpotret di dalam kelas merupakan cermin objektif yang memandu kita untuk mengenali kekuatan yang harus dirawat serta kelemahan yang harus segera dibenahi. Melalui laporan ini, kita diingatkan kembali bahwa mutu pembelajaran bukanlah sebuah destinasi statis, melainkan sebuah perjalanan dinamis yang menuntut komitmen, integritas, dan konsistensi dari seluruh elemen pendidikan.
                        </p>

                        <p className="indent-12">
                          Implementasi Pembelajaran Mendalam (PM) dan Kurikulum Berbasis Cinta (KBC) yang telah dievaluasi dalam laporan ini merupakan langkah berani menuju ekosistem pendidikan yang lebih humanis dan substantif. Sinergi yang terbangun antara supervisor dan guru tidak boleh berhenti pada tahap penilaian, namun harus bertransformasi menjadi kolaborasi pembinaan yang berkelanjutan. Kita percaya bahwa pendidikan yang berkualitas hanya dapat lahir dari guru-guru yang tidak pernah berhenti berefleksi, yang mengajar dengan kedalaman makna, dan yang menyentuh setiap potensi peserta didik dengan ketulusan nilai-nilai kasih sayang.
                        </p>

                        <p className="indent-12">
                          Besar harapan kami agar rekomendasi strategis yang tertuang dalam laporan ini dapat diterima dan ditindaklanjuti sebagai dasar pengambilan kebijakan mutu di lingkungan madrasah. Semoga segala ikhtiar yang telah didokumentasikan ini menjadi kontribusi nyata dalam mewujudkan visi pendidikan Islam yang unggul, kompetitif, dan bermartabat. Dengan semangat perbaikan yang tiada henti, mari kita terus berkolaborasi menghadirkan pengalaman belajar yang transformatif bagi seluruh peserta didik, demi lahirnya generasi yang tidak hanya cerdas secara intelektual, namun juga kokoh secara karakter dan spiritual.
                        </p>
                        <div className="pt-20 flex justify-end">
                          <div className="text-center w-64 font-sans">
                            <p className="text-sm">Jakarta, {config.tanggalCetak}</p>
                            <p className="text-sm mt-20 font-black underline uppercase">{config.namaSupervisor}</p>
                            <p className="text-xs">NIP. {config.nipSupervisor}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* --- LAMPIRAN 1-8: REKAPITULASI --- */}
                    {activities.map((act, idx) => {
                      const guruData = teachers.filter(t => assessmentResults[t.id] && assessmentResults[t.id][act.id]);
                      return (
                        <div key={act.id} className="min-h-[280mm] pt-10 space-y-10">
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-widest">LAMPIRAN {idx + 1}</h2>
                            <h3 className="text-lg font-bold uppercase italic font-sans text-slate-700">HASIL SUPERVISI INDIVIDUAL {act.title.toUpperCase()}</h3>
                          </div>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden font-sans shadow-sm text-[10px]">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="p-4 border-b border-r w-12 text-center">NO</th>
                                  <th className="p-4 border-b border-r">NAMA GURU</th>
                                  <th className="p-4 border-b border-r">MADRASAH / SATKER</th>
                                  <th className="p-4 border-b border-r text-center">SKOR AKHIR (%)</th>
                                  <th className="p-4 border-b text-center">PREDIKAT AKADEMIK</th>
                                </tr>
                              </thead>
                              <tbody>
                                {guruData.length > 0 ? (
                                  guruData.map((g, gIdx) => {
                                    const res = calculateReport(g.id, act.id);
                                    return (
                                      <tr key={g.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 border-r text-center">{gIdx + 1}</td>
                                        <td className="p-4 border-r font-black uppercase text-slate-700">{g.nama_guru}</td>
                                        <td className="p-4 border-r font-medium">{g.madrasah}</td>
                                        <td className="p-4 border-r text-center font-black text-slate-800">{res.percentage}%</td>
                                        <td className="p-4 text-center">
                                          <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase ${res.criteria === "Sangat Baik" ? 'bg-emerald-100 text-emerald-700' :
                                              res.criteria === "Baik" ? 'bg-blue-100 text-blue-700' :
                                                res.criteria === "Cukup" ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {res.criteria}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr><td colSpan="5" className="p-20 text-center italic text-slate-400">Belum ada data.</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}

                    {/* --- LAMPIRAN 9-16: RINCIAN INSTRUMEN (DETAIL) --- */}
                    {activities.map((act, idx) => {
                      const guruData = teachers.filter(t => assessmentResults[t.id] && assessmentResults[t.id][act.id]);
                      if (guruData.length === 0) return null;

                      return (
                        <div key={`rincian-${act.id}`} className="pt-10 space-y-16 page-break-before font-sans">
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-widest">LAMPIRAN {idx + 9}</h2>
                            <h3 className="text-lg font-bold uppercase italic text-slate-700">RINCIAN INSTRUMEN SUPERVISI INDIVIDUAL: {act.title.toUpperCase()}</h3>
                          </div>

                          {guruData.map((guru) => {
                            const results = assessmentResults[guru.id][act.id];
                            const resReport = calculateReport(guru.id, act.id);
                            const recoObj = getRecommendation(resReport.percentage, act.title);
                            const questions = ACTIVITY_QUESTIONS[act.id] || ACTIVITY_QUESTIONS.default;

                            return (
                              <div key={guru.id} className="space-y-6 border-t-2 border-slate-100 pt-10">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">INSTRUMEN GURU: {guru.nama_guru}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase">{guru.madrasah} • {results.timestamp}</p>
                                  </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden text-[9px]">
                                  <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50">
                                      <tr>
                                        <th className="p-3 border-b border-r w-10 text-center">NO</th>
                                        <th className="p-3 border-b">INDIKATOR PENILAIAN</th>
                                        <th className="p-3 border-b border-l w-16 text-center">SKOR</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        let counter = 1;
                                        return questions.map((cat, catI) => (
                                          <React.Fragment key={catI}>
                                            <tr className="bg-slate-50/50"><td colSpan="3" className="px-3 py-1.5 font-black text-[8px] uppercase text-slate-400 italic">{cat.category}</td></tr>
                                            {cat.items.map((item, itemI) => {
                                              const scoreVal = SCORE_MAP[results.scores[`${catI}_${itemI}`]] || 0;
                                              return (
                                                <tr key={itemI} className="border-b last:border-0">
                                                  <td className="p-3 border-r text-center font-bold text-slate-400">{counter++}</td>
                                                  <td className="p-3 text-slate-700 leading-relaxed">{item}</td>
                                                  <td className="p-3 border-l text-center font-black text-[#2D7A78] text-sm">{scoreVal}</td>
                                                </tr>
                                              );
                                            })}
                                          </React.Fragment>
                                        ));
                                      })()}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Summary Box (Detail ala Modal) */}
                                <div className="grid grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
                                  <div className="p-4 bg-slate-800 text-white text-center border-r border-slate-700">
                                    <p className="text-[7px] font-black uppercase text-slate-400">Skor Maksimal</p>
                                    <p className="text-xl font-black">{resReport.max}</p>
                                  </div>
                                  <div className="p-4 bg-slate-800 text-white text-center border-r border-slate-700">
                                    <p className="text-[7px] font-black uppercase text-slate-400">Skor Perolehan</p>
                                    <p className="text-xl font-black text-teal-400">{resReport.obtained}</p>
                                  </div>
                                  <div className="p-4 bg-slate-800 text-white text-center border-r border-slate-700">
                                    <p className="text-[7px] font-black uppercase text-slate-400">Nilai Akhir</p>
                                    <p className="text-xl font-black">{resReport.percentage}%</p>
                                  </div>
                                  <div className="p-4 bg-slate-100 text-center">
                                    <p className="text-[7px] font-black uppercase text-slate-400">Predikat</p>
                                    <p className={`text-xl font-black uppercase ${recoObj.color}`}>{recoObj.predikat}</p>
                                  </div>
                                </div>

                                <div className={`${recoObj.bg} p-4 rounded-xl border border-slate-100 italic text-[10px] text-slate-700 leading-relaxed`}>
                                  <strong>Rekomendasi Strategis:</strong> "{recoObj.reco}"
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}

                  </div>
                </div>
              )}
            </div>
          )}

              {/* --- VIEW PENGATURAN (SETTINGS) --- */}
              
              {activeMenu === 'Pengaturan' && (
                <div className="animate-in zoom-in duration-300 no-print">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">Pengaturan Aplikasi</h2>

                  <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">Konfigurasi Laporan</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Supervisor</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          value={config.namaSupervisor}
                          onChange={(e) => setConfig({ ...config, namaSupervisor: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">NIP Supervisor</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          value={config.nipSupervisor}
                          onChange={(e) => setConfig({ ...config, nipSupervisor: e.target.value })}
                        />
                      </div>

                      <hr className="my-4 border-slate-100" />

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Atasan Langsung</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          value={config.namaAtasan}
                          onChange={(e) => setConfig({ ...config, namaAtasan: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">NIP Atasan</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          value={config.nipAtasan}
                          onChange={(e) => setConfig({ ...config, nipAtasan: e.target.value })}
                        />
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tanggal Cetak Dokumen</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          placeholder="Contoh: 15 Juli 2026"
                          value={config.tanggalCetak}
                          onChange={(e) => setConfig({ ...config, tanggalCetak: e.target.value })}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tahun Ajaran</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-bold text-slate-700"
                          placeholder="Contoh: 2025/2026"
                          value={config.tahunAjaran || ''} 
                          onChange={(e) => setConfig({ ...config, tahunAjaran: e.target.value })}
                        />
                      </div>

                    </div>
                  </div>
                </div>
            )}
          
          
        </section>
      </main>
      


{/* MODAL DETAIL RINCIAN PENILAIAN DENGAN REKOMENDASI DINAMIS */ }
{
  showDetailModal && detailData && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 print:static print:p-0 print:bg-white print-detail">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300 print:max-h-none print:shadow-none print:rounded-none print:w-full">

        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 print:bg-white print:p-0 print:mb-4">
          <div className="w-full text-center">
            <h2 className="text-2xl text-center font-black text-slate-800 uppercase tracking-tight print:text-xl">
              {detailData.activityTitle}
            </h2>
            <div className="mt-6 grid grid-cols-[180px_20px_1fr] gap-y-2 text-sm print:text-sm text-left">

           <div className="font-semibold">Nama Guru</div>
           <div>:</div>
           <div>{selectedLaporanTeacher?.nama_guru || "-"}</div>

           <div className="font-semibold">Madrasah</div>
           <div>:</div>
           <div>{selectedLaporanTeacher?.madrasah || "-"}</div>

           <div className="font-semibold">Mata Pelajaran</div>
           <div>:</div>
           <div>{selectedLaporanTeacher?.subject || selectedLaporanTeacher?.mapel || "-"}</div>

           <div className="font-semibold">Tanggal Supervisi</div>
           <div>:</div>
           <div>{new Date().toLocaleDateString("id-ID")}</div>

        </div>
          </div>
          <div className="flex gap-3 no-print">
            <button onClick={handlePrintDetail} className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Printer size={14} /> Cetak PDF
            </button>
            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-red-50 rounded-full text-slate-300 hover:text-red-500 transition-colors">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-8 print:p-0 print:overflow-visible text-[10px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100">
                <th className="pb-4 pl-4 w-16">No</th>
                <th className="pb-4">Indikator Penilaian</th>
                <th className="pb-4 pr-6 text-right">Skor Butir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(() => {
                let globalCounter = 1;
                return detailData.questions.map((cat, catIdx) => (
                  <React.Fragment key={catIdx}>
                    <tr className="bg-slate-50/50 print:bg-slate-100">
                      <td colSpan="3" className="py-2 px-4 text-[10px] font-black text-slate-400 uppercase italic">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, itemIdx) => {
                      const scoreKey = `${catIdx}_${itemIdx}`;
                      const scoreLetter = detailData.savedScores[scoreKey];
                      const scoreNumber = SCORE_MAP[scoreLetter] || 0;
                      return (
                        <tr key={itemIdx} className="hover:bg-teal-50/30 transition-colors">
                          <td className="py-4 pl-6 text-sm font-bold text-slate-400">{globalCounter++}</td>
                          <td className="py-4 pr-10 text-sm text-slate-700 leading-relaxed">{item}</td>
                          <td className="py-4 pr-6 text-right font-black text-[#2D7A78] text-base">{scoreNumber}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ));
              })()}
            </tbody>
          </table>
        </div>

        {(() => {
          const scores = Object.values(detailData.savedScores);
          const perolehan = scores.reduce((acc, curr) => acc + (SCORE_MAP[curr] || 0), 0);
          const maksimal = scores.length * 4;
          const nilaiAkhir = maksimal > 0 ? ((perolehan / maksimal) * 100).toFixed(2) : 0;
          const res = getRecommendation(nilaiAkhir, detailData.activityTitle);

          return (
            <div className="border-t border-slate-100 print:mt-10">
              <div className="p-8 bg-slate-800 text-white grid grid-cols-2 md:grid-cols-4 gap-8 print:bg-slate-100 print:text-slate-900 print:p-4 print:border print:border-slate-300">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Skor Maksimal</span>
                  <span className="text-2xl font-black">{maksimal}</span>
                </div>
                <div className="flex flex-col border-l border-slate-700 pl-8 print:border-slate-300">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Skor Perolehan</span>
                  <span className="text-2xl font-black text-teal-400 print:text-[#2D7A78]">{perolehan}</span>
                </div>
                <div className="flex flex-col border-l border-slate-700 pl-8 print:border-slate-300">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nilai Akhir</span>
                  <span className="text-2xl font-black">{nilaiAkhir}%</span>
                </div>
                <div className="flex flex-col border-l border-slate-700 pl-8 print:border-slate-300">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Predikat</span>
                  <span className={`text-2xl font-black uppercase ${res.color}`}>{res.predikat}</span>
                </div>
              </div>
              <div className={`p-8 ${res.bg} border-t border-white/20 print:bg-white print:p-4 print:border print:border-slate-300 print:mt-4`}>
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 p-2 rounded-lg ${res.color} bg-white shadow-sm no-print`}> <Award size={20} /> </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${res.color} mb-2`}>Rekomendasi Tindak Lanjut:</h4>
                    <p className="text-slate-700 leading-relaxed font-medium italic">"{res.reco}"</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  )
}

{/* GLOBAL PRINT CSS */ }
<style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @media print { 
          nav, aside, header, button, .no-print, .sidebar { display: none !important; } 
          body { background: white !important; margin: 0 !important; padding: 0 !important; } 
          main, section, .max-w-4xl, .max-w-5xl, .modal-content { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; height: auto !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .overflow-y-auto { overflow: visible !important; max-height: none !important; }
          .font-serif { font-family: "Noto Serif", serif !important; }
          .page-break-after { page-break-after: always; }
          .page-break-before { page-break-before: always; }
          .break-inside-avoid { break-inside: avoid; }
          table { width: 100% !important; border-collapse: collapse !important; page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          td, th { border: 1px solid #e2e8f0 !important; padding: 8px !important; }
          .fixed.inset-0 { position: relative !important; z-index: auto !important; }
          
          /* mode default: cetak rapor */
         .print-detail {
           display:none !important;
          }

          /* jika print detail aktif */
          body.print-detail-mode .print-rapor {
            display:none !important;
          }

          body.print-detail-mode .print-detail {
            display:block !important;
          }
        }
      `}</style>
    </div >
  );
};


// --- Komponen Entry Point ---

export default function App() {

  const [view, setView] = useState('landing');
  const [targetMenu, setTargetMenu] = useState('Dashboard');
  const currentUser = localStorage.getItem("user_id")
  window.user_id = currentUser
  console.log("USER ID AKTIF:", window.user_id)
  const handleNavigate = (menu) => {
    
    if (!currentUser && menu !== "Login") {
      alert("Silakan login terlebih dahulu.")
      setView("login")
      return
    }

    if (menu === 'Login') {
      setView('login')
    } else {
      setTargetMenu(menu)
      setView('dashboard')
    }
  };
  return (
    <div className="transition-all duration-500 min-h-screen">
      
      {view === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {view === 'dashboard' && <Dashboard initialMenu={targetMenu} onLogout={() => {
        localStorage.removeItem("user_id")
        window.user_id = null
        setTargetMenu("Dashboard")
        setView("landing")
        }} 
      />}
      {view === 'login' && (<LoginPage onBack={() => setView('landing')} onLoginSuccess={() => { setTargetMenu('Dashboard'); setView('dashboard'); }} />)}
    </div>
  );

}

function LoginPage({ onBack, onLoginSuccess }) {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("users_access")
      .select("username,user_id,role")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (!data) {
      alert("User tidak ditemukan. Hubungi Admin WA.")
      return
    }

    localStorage.setItem("user_id", data.user_id)

    onLoginSuccess()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold">Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded w-64"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleLogin}
        className="bg-[#2D7A78] text-white px-6 py-2 rounded"
      >
        Login
      </button>

      <button onClick={onBack} className="text-sm underline">
        Kembali
      </button>
    </div>
  )
}
