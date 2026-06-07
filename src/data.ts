/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AcademicEvent, CategorySpec, MonthMeta } from './types';

export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  pembelajaran: {
    id: 'pembelajaran',
    label: 'KBM Efektif / Orientasi',
    color: 'emerald',
    bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-500',
    accentClass: 'bg-emerald-500',
    description: 'Kegiatan Belajar Mengajar efektif, MPLS siswa baru, dan matrikulasi.',
  },
  ujian: {
    id: 'ujian',
    label: 'Penilaian / Ujian',
    color: 'amber',
    bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-500',
    accentClass: 'bg-amber-500',
    description: 'Sumatif Tengah Semester (STS), Sumatif Akhir Semester (SAS), Ujian Sekolah (US/ASAJ), dan ANBK.',
  },
  libur_nasional: {
    id: 'libur_nasional',
    label: 'Libur Nasional',
    color: 'red',
    bgClass: 'bg-red-50 text-red-800 border-red-200',
    textClass: 'text-red-600',
    borderClass: 'border-red-500',
    accentClass: 'bg-red-500',
    description: 'Libur resmi berdasarkan keputusan tiga menteri (SKB 3 Menteri).',
  },
  libur_semester: {
    id: 'libur_semester',
    label: 'Libur Semester / Akhir Ajaran',
    color: 'rose',
    bgClass: 'bg-rose-50 text-rose-800 border-rose-200',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-500',
    accentClass: 'bg-rose-500',
    description: 'Libur resmi jeda semester ganjil atau akhir tahun ajaran sekolah.',
  },
  kegiatan: {
    id: 'kegiatan',
    label: 'Kegiatan Sekolah / Non-KBM',
    color: 'indigo',
    bgClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-500',
    accentClass: 'bg-indigo-500',
    description: 'Rapat pleno, Class Meeting, pembagian rapor, penguatan karakter (P5), upacara, dan kelulusan.',
  },
  hari_penting: {
    id: 'hari_penting',
    label: 'Hari Besar / Upacara Khusus',
    color: 'sky',
    bgClass: 'bg-sky-50 text-sky-800 border-sky-200',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-500',
    accentClass: 'bg-sky-500',
    description: 'Hari besar nasional/keagamaan non-libur atau upacara peringatan khusus.',
  },
};

// Bulan untuk Tahun Ajaran 2026/2027 (Juli 2026 - Juni 2027)
export const ACADEMIC_MONTHS: MonthMeta[] = [
  // Semester 1 (Ganjil)
  { year: 2026, month: 6, name: 'Juli', semester: 1, totalDays: 31, weeks: 5 },
  { year: 2026, month: 7, name: 'Agustus', semester: 1, totalDays: 31, weeks: 5 },
  { year: 2026, month: 8, name: 'September', semester: 1, totalDays: 30, weeks: 5 },
  { year: 2026, month: 9, name: 'Oktober', semester: 1, totalDays: 31, weeks: 5 },
  { year: 2026, month: 10, name: 'November', semester: 1, totalDays: 30, weeks: 5 },
  { year: 2026, month: 11, name: 'Desember', semester: 1, totalDays: 31, weeks: 5 },
  // Semester 2 (Genap)
  { year: 2027, month: 0, name: 'Januari', semester: 2, totalDays: 31, weeks: 5 },
  { year: 2027, month: 1, name: 'Februari', semester: 2, totalDays: 28, weeks: 4 },
  { year: 2027, month: 2, name: 'Maret', semester: 2, totalDays: 31, weeks: 5 },
  { year: 2027, month: 3, name: 'April', semester: 2, totalDays: 30, weeks: 5 },
  { year: 2027, month: 4, name: 'Mei', semester: 2, totalDays: 31, weeks: 5 },
  { year: 2027, month: 5, name: 'Juni', semester: 2, totalDays: 30, weeks: 5 },
];

export const DEFAULT_EVENTS: AcademicEvent[] = [
  // === JULI 2026 ===
  {
    id: 'evt-jul-libur-prev',
    title: 'Libur Akhir Tahun Ajaran 2025/2026',
    description: 'Masa libur panjang transisi perpindahan kelas dan penerimaan siswa baru.',
    startDate: '2026-07-01',
    endDate: '2026-07-11',
    category: 'libur_semester',
    semester: 1,
    isHoliday: true,
  },
  {
    id: 'evt-jul-masuk-ganjil',
    title: 'Hari Pertama Sekolah & Awal Semester Ganjil',
    description: 'Permulaan kegiatan akademik Semester Ganjil Tahun Ajaran 2026/2027.',
    startDate: '2026-07-13',
    endDate: '2026-07-13',
    category: 'pembelajaran',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-jul-mpls',
    title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)',
    description: 'Kegiatan pengenalan sekolah kepada siswa baru kelas VII SMP atau kelas X SMA.',
    startDate: '2026-07-13',
    endDate: '2026-07-15',
    category: 'pembelajaran',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-jul-anak-nasional',
    title: 'Hari Anak Nasional',
    description: 'Peringatan Hari Anak Nasional untuk meningkatkan kepedulian terhadap hak-hak anak.',
    startDate: '2026-07-23',
    endDate: '2026-07-23',
    category: 'hari_penting',
    semester: 1,
    isHoliday: false,
  },

  // === AGUSTUS 2026 ===
  {
    id: 'evt-ags-kemerdekaan',
    title: 'Hari Kemerdekaan Republik Indonesia (HUT RI ke-81)',
    description: 'Upacara bendera dan kegiatan perayaan HUT Kemerdekaan RI di sekolah.',
    startDate: '2026-08-17',
    endDate: '2026-08-17',
    category: 'libur_nasional',
    semester: 1,
    isHoliday: true,
  },
  {
    id: 'evt-ags-anbk-simulasi',
    title: 'Simulasi/Gladi Bersih ANBK',
    description: 'Gladi bersih komputerisasi Asesmen Nasional Berbasis Komputer jenjang SMP/SMA.',
    startDate: '2026-08-24',
    endDate: '2026-08-27',
    category: 'ujian',
    semester: 1,
    isHoliday: false,
  },

  // === SEPTEMBER 2026 ===
  {
    id: 'evt-sep-sts-ganjil',
    title: 'Sumatif Tengah Semester (STS) Ganjil',
    description: 'Penilaian/ujian tengah semester untuk mengukur ketercapaian kompetensi di paruh awal semester.',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    category: 'ujian',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-sep-maulid',
    title: 'Maulid Nabi Muhammad SAW 1448 H',
    description: 'Hari libur keagamaan memperingati kelahiran Nabi Muhammad SAW.',
    startDate: '2026-09-14',
    endDate: '2026-09-14',
    category: 'libur_nasional',
    semester: 1,
    isHoliday: true,
  },

  // === OKTOBER 2026 ===
  {
    id: 'evt-okt-pancasila',
    title: 'Hari Kesaktian Pancasila',
    description: 'Upacara peringatan hari Kesaktian Pancasila di lapangan sekolah.',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    category: 'hari_penting',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-okt-anbk',
    title: 'Pelaksanaan Asesmen Nasional (ANBK) Utama',
    description: 'Ujian nasional sampel pemetaan mutu pendidikan untuk siswa kelas VIII / XI.',
    startDate: '2026-10-12',
    endDate: '2026-10-15',
    category: 'ujian',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-okt-pemuda',
    title: 'Hari Sumpah Pemuda',
    description: 'Upacara khusus mengenang Ikrar Sumpah Pemuda tahun 1928.',
    startDate: '2026-10-28',
    endDate: '2026-10-28',
    category: 'hari_penting',
    semester: 1,
    isHoliday: false,
  },

  // === NOVEMBER 2026 ===
  {
    id: 'evt-nov-pahlawan',
    title: 'Hari Pahlawan',
    description: 'Upacara bendera memperingati pertempuran Surabaya 10 November.',
    startDate: '2026-11-10',
    endDate: '2026-11-10',
    category: 'hari_penting',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-nov-p5-projek',
    title: 'Pelaksanaan Projek Penguatan Profil Pelajar Pancasila (P5)',
    description: 'Pekan pameran karya dan eksplorasi tema kearifan lokal / kewirausahaan.',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    category: 'kegiatan',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-nov-guru',
    title: 'Hari Guru Nasional & HUT PGRI',
    description: 'Pemberian apresiasi kepada jajaran pendidik sekolah dan upacara khusus.',
    startDate: '2026-11-25',
    endDate: '2026-11-25',
    category: 'hari_penting',
    semester: 1,
    isHoliday: false,
  },

  // === DESEMBER 2026 ===
  {
    id: 'evt-des-sas',
    title: 'Sumatif Akhir Semester (SAS) Ganjil / PAS',
    description: 'Penilaian Sumatif Akhir Semester Ganjil kurikulum merdeka.',
    startDate: '2026-12-07',
    endDate: '2026-12-11',
    category: 'ujian',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-des-classmeet',
    title: 'Pekan Class Meeting & Remedial',
    description: 'Lomba antar kelas (olahraga, seni, e-sports) dan penyelesaian nilai tuntas belajar.',
    startDate: '2026-12-14',
    endDate: '2026-12-17',
    category: 'kegiatan',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-des-rapor',
    title: 'Pembagian Rapor Semester Ganjil',
    description: 'Penyerahan Laporan Hasil Belajar (LHB) semester ganjil kepada orang tua/wali murid.',
    startDate: '2026-12-18',
    endDate: '2026-12-18',
    category: 'kegiatan',
    semester: 1,
    isHoliday: false,
  },
  {
    id: 'evt-des-libur-ganjil',
    title: 'Libur Akhir Semester Ganjil',
    description: 'Masa libur semester jeda antara semester ganjil dan genap.',
    startDate: '2026-12-21',
    endDate: '2026-12-31',
    category: 'libur_semester',
    semester: 1,
    isHoliday: true,
  },
  {
    id: 'evt-des-natal',
    title: 'Hari Raya Natal',
    description: 'Libur nasional memperingati Hari Raya Natal umat Kristiani.',
    startDate: '2026-12-25',
    endDate: '2026-12-25',
    category: 'libur_nasional',
    semester: 1,
    isHoliday: true,
  },

  // === JANUARI 2027 ===
  {
    id: 'evt-jan-tahunbaru',
    title: 'Tahun Baru Masehi 2027',
    description: 'Hari libur nasional Tahun Baru Masehi 2027.',
    startDate: '2027-01-01',
    endDate: '2027-01-01',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-jan-masuk-genap',
    title: 'Hari Pertama Masuk Sekolah Semester Genap',
    description: 'Permulaan KBM semester genap Tahun Pelajaran 2026/2027.',
    startDate: '2027-01-04',
    endDate: '2027-01-04',
    category: 'pembelajaran',
    semester: 2,
    isHoliday: false,
  },
  {
    id: 'evt-jan-isramiraj',
    title: 'Isra Mi\'raj Nabi Muhammad SAW',
    description: 'Hari libur nasional memperingati Isra Mi\'raj Nabi Muhammad SAW.',
    startDate: '2027-01-25',
    endDate: '2027-01-25',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },

  // === FEBRUARI 2027 ===
  {
    id: 'evt-feb-imlek',
    title: 'Tahun Baru Imlek 2578 (Gong Xi Fa Cai)',
    description: 'Hari libur nasional menyambut Tahun Baru Imlek.',
    startDate: '2027-02-06',
    endDate: '2027-02-06',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-feb-p5-tema2',
    title: 'Projek P5 Tema 2: Suara Demokrasi',
    description: 'Pelaksanaan projek penguatan karakter dengan simulasi pemilu ketua OSIS.',
    startDate: '2027-02-15',
    endDate: '2027-02-18',
    category: 'kegiatan',
    semester: 2,
    isHoliday: false,
  },

  // === MARET 2027 ===
  {
    id: 'evt-mar-libur-ramadan',
    title: 'Libur Permulaan Puasa Ramadan 1448 H',
    description: 'Libur khusus permulaan puasa Ramadan untuk toleransi ibadah.',
    startDate: '2027-03-08',
    endDate: '2027-03-10',
    category: 'libur_semester',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-mar-sts-genap',
    title: 'Sumatif Tengah Semester (STS) Genap',
    description: 'Ujian evaluasi capaian belajar paruh pertama semester genap.',
    startDate: '2027-03-15',
    endDate: '2027-03-19',
    category: 'ujian',
    semester: 2,
    isHoliday: false,
  },
  {
    id: 'evt-mar-wafat-yesus',
    title: 'Wafat Yesus Kristus',
    description: 'Hari libur nasional keagamaan memperingati Wafat Yesus Kristus.',
    startDate: '2027-03-26',
    endDate: '2027-03-26',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },

  // === APRIL 2027 ===
  {
    id: 'evt-apr-fitri-sekitar',
    title: 'Libur Har-Nas Hari Raya Idul Fitri 1448 H',
    description: 'Libur sekitar lebaran / Idul Fitri sesuai cuti bersama pemerintah.',
    startDate: '2027-04-05',
    endDate: '2027-04-10',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-apr-fitri',
    title: 'Hari Raya Idul Fitri 1448 H (1 & 2 Syawal)',
    description: 'Libur perayaan hari besar kemenangan Idul Fitri umat Islam.',
    startDate: '2027-04-08',
    endDate: '2027-04-09',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-apr-ujiansp',
    title: 'Sumatif Akhir Jenjang (Ujian Sekolah/US Kelas Akhir)',
    description: 'Asesmen komprehensif tertulis untuk penentuan kelulusan siswa kelas tingkat akhir.',
    startDate: '2027-04-26',
    endDate: '2027-04-30',
    category: 'ujian',
    semester: 2,
    isHoliday: false,
  },

  // === MEI 2027 ===
  {
    id: 'evt-mei-buruh',
    title: 'Hari Buruh Internasional',
    description: 'Libur nasional memperingati Hari Buruh sedunia.',
    startDate: '2027-05-01',
    endDate: '2027-05-01',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-mei-kenaikan',
    title: 'Hari Kenaikan Yesus Kristus',
    description: 'Libur keagamaan memperingati Kenaikan Yesus Kristus.',
    startDate: '2027-05-06',
    endDate: '2027-05-06',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-mei-idul-adha',
    title: 'Hari Raya Idul Adha 1448 H',
    description: 'Libur nasional perayaan hari raya kurban.',
    startDate: '2027-05-17',
    endDate: '2027-05-17',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-mei-waisak',
    title: 'Hari Raya Waisak 2571',
    description: 'Libur nasional memperingati Hari Raya Waisak umat Buddha.',
    startDate: '2027-05-20',
    endDate: '2027-05-20',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-mei-harkitnas',
    title: 'Hari Kebangkitan Nasional',
    description: 'Upacara bendera memperingati Hari Kebangkitan Nasional.',
    startDate: '2027-05-20',
    endDate: '2027-05-20',
    category: 'hari_penting',
    semester: 2,
    isHoliday: false,
  },

  // === JUNI 2027 ===
  {
    id: 'evt-jun-pancasila',
    title: 'Hari Lahir Pancasila',
    description: 'Hari libur nasional memperingati Hari Lahir Pancasila.',
    startDate: '2027-06-01',
    endDate: '2027-06-01',
    category: 'libur_nasional',
    semester: 2,
    isHoliday: true,
  },
  {
    id: 'evt-jun-sat',
    title: 'Sumatif Akhir Tahun (SAT) / UKK',
    description: 'Penilaian akhir tahun untuk kenaikan kelas Kurikulum Merdeka atau ujian kenaikan kelas.',
    startDate: '2027-06-07',
    endDate: '2027-06-11',
    category: 'ujian',
    semester: 2,
    isHoliday: false,
  },
  {
    id: 'evt-jun-classmeet',
    title: 'Class Meeting & Rapat Kelulusan',
    description: 'Pertemuan pleno dewan guru mengolah nilai rapor dan menetapkan kenaikan kelas.',
    startDate: '2027-06-14',
    endDate: '2027-06-17',
    category: 'kegiatan',
    semester: 2,
    isHoliday: false,
  },
  {
    id: 'evt-jun-rapor-kelulusan',
    title: 'Pembagian Rapor Semester Genap & Kelulusan',
    description: 'Serah terima rapor akhir tahun ajaran sekalian pengumuman kelulusan kelas akhir.',
    startDate: '2027-06-18',
    endDate: '2027-06-18',
    category: 'kegiatan',
    semester: 2,
    isHoliday: false,
  },
  {
    id: 'evt-jun-libur-akhir',
    title: 'Libur Akhir Tahun Pelajaran 2026/2027',
    description: 'Masa libur besar penutup akhir tahun ajaran 2026/2027.',
    startDate: '2027-06-21',
    endDate: '2027-06-30',
    category: 'libur_semester',
    semester: 2,
    isHoliday: true,
  },
];

/**
 * Memeriksa apakah sebuah tanggal libur akhir pekan.
 * @param dateString Format YYYY-MM-DD
 * @param schoolWeek '5' atau '6' hari sekolah
 */
export function isWeekend(dateString: string, schoolWeek: '5' | '6'): boolean {
  const d = new Date(dateString);
  const day = d.getDay(); // 0 = Minggu, 6 = Sabtu, 1 = Senin, dst
  if (schoolWeek === '5') {
    return day === 0 || day === 6; // Minggu & Sabtu
  } else {
    return day === 0; // Minggu saja
  }
}

/**
 * Mendapatkan representasi index hari 0-6 dengan penamaan lokal Indonesia.
 */
export const HARI_NAMA_PANJANG = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const HARI_NAMA_PENDEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const BULAN_NAMA_LENGKAP = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Menghitung daftar tanggal antara startDate sampai endDate secara inklusif.
 */
export function getDatesInRange(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  // Gunakan date UTC / lokal yang aman tanpa bergeser akibat timezone
  const current = new Date(start);
  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Menghitung jumlah hari belajar efektif dan libur untuk suatu bulan
 */
export function countMonthlyDays(
  year: number,
  month: number, // 0-indexed (0 = Jan, 11 = Des)
  events: AcademicEvent[],
  schoolWeek: '5' | '6'
) {
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  let calendarDays = totalDaysInMonth;
  let holidays = 0;
  let effectiveDays = 0;

  // Petakan event yang berkategori "isHoliday === true"
  // Buat set untuk mengidentifikasi tanggal mana saja yang bertanda libur berdasarkan event
  const holidayDateSet = new Set<string>();
  
  events.forEach(evt => {
    if (evt.isHoliday) {
      const dates = getDatesInRange(evt.startDate, evt.endDate);
      dates.forEach(dStr => {
        const d = new Date(dStr);
        if (d.getFullYear() === year && d.getMonth() === month) {
          holidayDateSet.add(dStr);
        }
      });
    }
  });

  for (let day = 1; day <= totalDaysInMonth; day++) {
    // Format tanggal saat ini
    const mmStr = String(month + 1).padStart(2, '0');
    const ddStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${mmStr}-${ddStr}`;

    const isWeekEndDay = isWeekend(dateStr, schoolWeek);
    const isHolidayEvent = holidayDateSet.has(dateStr);

    if (isWeekEndDay || isHolidayEvent) {
      holidays++;
    } else {
      effectiveDays++;
    }
  }

  return {
    calendarDays,
    holidays,
    effectiveDays,
  };
}
