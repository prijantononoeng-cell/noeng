/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory = 
  | 'pembelajaran'       // Pembelajaran Efektif, Orientasi (MPLS)
  | 'ujian'              // Penilaian Harian, STS, SAS, SAT, Ujian Sekolah
  | 'libur_nasional'     // Libur Nasional Resmi
  | 'libur_semester'     // Libur Akhir Semester Ganjil / Genap
  | 'kegiatan'           // Rapat Guru, Class Meeting, Pembagian Rapor, Kelulusan
  | 'hari_penting';      // Hari besar lainnya atau upacara khusus

export interface AcademicEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // Format YYYY-MM-DD
  endDate: string;   // Format YYYY-MM-DD (inclusive)
  category: EventCategory;
  semester: 1 | 2;   // 1 = Ganjil, 2 = Genap
  isHoliday: boolean; // Jika true, maka mengurangi hari efektif belajar
}

export interface CategorySpec {
  id: EventCategory;
  label: string;
  color: string;         // Base color name for custom display (e.g., 'emerald')
  bgClass: string;       // Tailwind bg class
  textClass: string;     // Tailwind text class
  borderClass: string;   // Tailwind border class
  accentClass: string;   // Accent dots/borders
  description: string;
}

export interface MonthMeta {
  year: number;
  month: number; // 0-indexed (0 = Januari, 11 = Desember)
  name: string;
  semester: 1 | 2;
  totalDays: number;
  weeks: number;
}

export interface SchoolStats {
  totalCalendarDays: number;
  totalHolidays: number;
  totalEffectiveDays: number;
  totalEvents: number;
}

export interface MonthlyStats {
  monthKey: string; // "YYYY-MM"
  calendarDays: number;
  holidays: number;
  effectiveDays: number;
  eventCount: number;
}
