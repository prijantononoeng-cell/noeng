/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Clock,
  Printer,
  FileDown,
  RotateCcw,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Search,
  BookOpen,
  Trash2,
  Edit2,
  Settings
} from 'lucide-react';
import { AcademicEvent, EventCategory } from './types';
import {
  CATEGORY_SPECS,
  ACADEMIC_MONTHS,
  DEFAULT_EVENTS,
  BULAN_NAMA_LENGKAP,
  countMonthlyDays,
  getDatesInRange
} from './data';
import { StatCard } from './components/StatCard';
import { EventForm } from './components/EventForm';
import { MonthGrid } from './components/MonthGrid';
import { StatsDetail } from './components/StatsDetail';
import { ConfirmDialog } from './components/ConfirmDialog';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';

export default function App() {
  // --- STATE ---
  const [events, setEvents] = useState<AcademicEvent[]>(() => {
    const saved = localStorage.getItem('kalpend_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Gagal memuat event dari localStorage, menggunakan default.', e);
      }
    }
    return DEFAULT_EVENTS;
  });

  const [schoolWeek, setSchoolWeek] = useState<'5' | '6'>(() => {
    const saved = localStorage.getItem('kalpend_school_week');
    return (saved === '5' || saved === '6') ? saved : '5';
  });

  // --- SCHOOL SETTINGS STATE ---
  const [academicYear, setAcademicYear] = useState<string>(() => {
    return localStorage.getItem('kalpend_academic_year') || '2026/2027';
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    return localStorage.getItem('kalpend_school_name') || 'SMA Negeri 1 Jakarta';
  });

  const [schoolCity, setSchoolCity] = useState<string>(() => {
    return localStorage.getItem('kalpend_school_city') || 'Jakarta Pusat';
  });

  const [schoolLogo, setSchoolLogo] = useState<string | null>(() => {
    return localStorage.getItem('kalpend_school_logo') || null;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(0); // Default: Juli 2026 (index 0)
  const [viewMode, setViewMode] = useState<'bulanan' | 'tahunan' | 'agenda' | 'statistik'>('bulanan');
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-07-13'); // Hari pertama sekolah
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'semua'>('semua');
  const [filterSemester, setFilterSemester] = useState<1 | 2 | 'semua'>('semua');
  
  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);

  // Custom Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string; isDanger?: boolean }
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      isDanger: options?.isDanger ?? true,
    });
  };

  // --- PERSISTENCE EFFECT ===
  useEffect(() => {
    localStorage.setItem('kalpend_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('kalpend_school_week', schoolWeek);
  }, [schoolWeek]);

  useEffect(() => {
    localStorage.setItem('kalpend_academic_year', academicYear);
  }, [academicYear]);

  useEffect(() => {
    localStorage.setItem('kalpend_school_name', schoolName);
  }, [schoolName]);

  useEffect(() => {
    localStorage.setItem('kalpend_school_city', schoolCity);
  }, [schoolCity]);

  useEffect(() => {
    if (schoolLogo) {
      localStorage.setItem('kalpend_school_logo', schoolLogo);
    } else {
      localStorage.removeItem('kalpend_school_logo');
    }
  }, [schoolLogo]);

  // --- HANDLERS ---
  const handleAddEvent = (newEventData: Omit<AcademicEvent, 'id'> & { id?: string }) => {
    if (newEventData.id) {
      // Edit mode
      setEvents((prev) =>
        prev.map((e) => (e.id === newEventData.id ? (newEventData as AcademicEvent) : e))
      );
    } else {
      // New event
      const newEvent: AcademicEvent = {
        ...newEventData,
        id: `evt-${Date.now()}`,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (selectedDate) {
      const remainingForDay = events.filter(e => e.id !== id && selectedDate >= e.startDate && selectedDate <= e.endDate);
      if (remainingForDay.length === 0) {
        // Biarkan terpilih tapi detailnya kosong
      }
    }
  };

  const handleResetToDefault = () => {
    triggerConfirm(
      'Atur Ulang Kalender',
      'Apakah Anda yakin ingin mengembalikan semua kegiatan kalender pendidikan ke pengaturan awal (default)? Hal ini akan menghapus semua kegiatan baru yang Anda buat.',
      () => {
        setEvents(DEFAULT_EVENTS);
        setSelectedDate('2026-07-13');
        setCurrentMonthIdx(0);
        setSchoolWeek('5');
      },
      { confirmText: 'Atur Ulang', isDanger: true }
    );
  };

  const handleMonthFocus = (focusedMonthIndex: number) => {
    setCurrentMonthIdx(focusedMonthIndex);
    setViewMode('bulanan');
  };

  // --- STATS CALCULATION ---
  const activeMonthMeta = ACADEMIC_MONTHS[currentMonthIdx];
  
  // Total keseluruhan
  const statsSummary = React.useMemo(() => {
    let totalCalendarDays = 0;
    let totalHolidays = 0;
    let totalEffectiveDays = 0;

    ACADEMIC_MONTHS.forEach((m) => {
      const counts = countMonthlyDays(m.year, m.month, events, schoolWeek);
      totalCalendarDays += counts.calendarDays;
      totalHolidays += counts.holidays;
      totalEffectiveDays += counts.effectiveDays;
    });

    return {
      totalCalendarDays,
      totalHolidays,
      totalEffectiveDays,
      totalEvents: events.length,
    };
  }, [events, schoolWeek]);

  // Event pada tanggal yang saat ini dipilih
  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => selectedDate >= e.startDate && selectedDate <= e.endDate);
  }, [selectedDate, events]);

  // Event yang disaring untuk Tampilan Agenda
  const filteredEventsForAgenda = React.useMemo(() => {
    return events
      .filter((evt) => {
        const matchesSearch =
          evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = filterCategory === 'semua' || evt.category === filterCategory;
        const matchesSemester = filterSemester === 'semua' || evt.semester === filterSemester;

        return matchesSearch && matchesCategory && matchesSemester;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, searchQuery, filterCategory, filterSemester]);

  // --- EXPORT FUNCS ---
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Judul,Deskripsi,Kategori,Tanggal Mulai,Tanggal Selesai,Semester,Libur Sekolah\n';

    events.forEach((e) => {
      const desc = e.description ? e.description.replace(/"/g, '""') : '';
      const row = `"${e.id}","${e.title}","${desc}","${e.category}","${e.startDate}","${e.endDate}","${e.semester}","${e.isHoliday ? 'Ya' : 'Tidak'}"`;
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeYear = academicYear.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Kalender_Pendidikan_${safeSchoolName}_TP_${safeYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeYear = academicYear.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Kalender_Pendidikan_${safeSchoolName}_TP_${safeYear}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    setIsPrintPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white print:bg-white print:text-black">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 py-4 shadow-xs backdrop-blur-md print:static print:border-b-0 print:shadow-none">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            {schoolLogo ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-150 bg-white p-1 shadow-xs shadow-indigo-50">
                <img 
                  src={schoolLogo} 
                  alt="Logo Sekolah" 
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-200">
                <GraduationCap className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="font-sans text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {schoolName}
              </h1>
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase sm:text-sm">
                Tahun Ajaran {academicYear} • Kota/Kab. {schoolCity}
              </p>
            </div>
          </div>

          {/* Quick Config Controls */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            
            {/* School Day Toggle */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <span className="pl-2.5 text-xs font-bold text-slate-500 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5" />
                Sistem Sekolah:
              </span>
              <button
                onClick={() => setSchoolWeek('5')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  schoolWeek === '5'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                5 Hari (Sab-Min Libur)
              </button>
              <button
                onClick={() => setSchoolWeek('6')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  schoolWeek === '6'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                6 Hari (Min Libur)
              </button>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerPrint}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50 hover:border-slate-350 hover:text-slate-900 transition-colors cursor-pointer"
                title="Cetak Kalender Pendidikan"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden lg:inline">Cetak</span>
              </button>
              
              <div className="relative group">
                <button
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50 hover:border-slate-350 transition-colors cursor-pointer"
                  title="Unduh / Ekspor Data"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="hidden lg:inline">Unduh</span>
                </button>
                {/* Dropdown on hover */}
                <div className="invisible absolute right-0 mt-1 w-44 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-lg group-hover:visible transition-all">
                  <button
                    onClick={exportToCSV}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Ekspor Excel (CSV)
                  </button>
                  <button
                    onClick={exportToJson}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Ekspor Backup (JSON)
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 p-2.5 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer"
                title="Pengaturan Profil & Identitas Sekolah"
              >
                <Settings className="h-4 w-4 text-indigo-600" />
                <span className="hidden lg:inline">Pengaturan</span>
              </button>

              <button
                onClick={handleResetToDefault}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-extrabold text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all cursor-pointer"
                title="Kembalikan semua kustomisasi ke default"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden lg:inline">Reset</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* METRICS BRIEFING CARD STRIP */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 print:hidden">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          
          <StatCard
            title="TOTAL HARI EFEKTIF"
            value={`${statsSummary.totalEffectiveDays} Hari`}
            subtitle="Hari kerja pembelajaran wajib KBM"
            icon={Clock}
            iconColor="text-emerald-600"
            bgGradient="from-emerald-50/40 via-white to-white"
          />

          <StatCard
            title="SABTU-MINGGU & LIBUR"
            value={`${statsSummary.totalHolidays} Hari`}
            subtitle="Hari non-belajar / libur akademik"
            icon={CalendarDays}
            iconColor="text-rose-600"
            bgGradient="from-rose-50/40 via-white to-white"
          />

          <StatCard
            title="TOTAL AGENDA KEGIATAN"
            value={`${statsSummary.totalEvents} Kegiatan`}
            subtitle="Ujian, libur, rapt & kegiatan sekolah"
            icon={Calendar}
            iconColor="text-indigo-600"
            bgGradient="from-indigo-50/40 via-white to-white"
          />

          <StatCard
            title="PERSENTASE KBM"
            value={`${((statsSummary.totalEffectiveDays / statsSummary.totalCalendarDays) * 100).toFixed(1)}%`}
            subtitle="Efektivitas belajar dalam 1 tahun"
            icon={Sparkles}
            iconColor="text-amber-600"
            bgGradient="from-amber-50/40 via-white to-white"
          />

        </div>
      </div>

      {/* MAIN APPLICATION CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* LEFT 2-COLUMNS: MAIN CALENDAR CONTROL AND VIEWS */}
          <div className="col-span-1 space-y-6 lg:col-span-2">
            
            {/* View Mode Switching Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 print:hidden">
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('bulanan')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'bulanan'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tampilan Bulanan
                </button>
                <button
                  onClick={() => setViewMode('tahunan')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'tahunan'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tampilan Tahunan (Bento)
                </button>
                <button
                  onClick={() => setViewMode('agenda')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'agenda'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daftar Agenda ({filteredEventsForAgenda.length})
                </button>
                <button
                  onClick={() => setViewMode('statistik')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'statistik'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Rincian RPE
                </button>
              </div>

              {/* Add event fast button */}
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Rancang Agenda</span>
              </button>
            </div>

            {/* PRESENTATION CONTAINER WITH TRANSITIONS */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                
                {/* 1. VIEW MODE: BULANAN */}
                {viewMode === 'bulanan' && (
                  <motion.div
                    key="view-bulanan"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Month Navigator */}
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-100 shadow-xs print:hidden">
                      <button
                        onClick={() => setCurrentMonthIdx((prev) => Math.max(0, prev - 1))}
                        disabled={currentMonthIdx === 0}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="text-center">
                        <h3 className="font-sans text-base font-bold text-indigo-950">
                          {activeMonthMeta.name} {activeMonthMeta.year}
                        </h3>
                        <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          Mulan akademik ke-{currentMonthIdx + 1} • Semester {activeMonthMeta.semester}
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentMonthIdx((prev) => Math.min(ACADEMIC_MONTHS.length - 1, prev + 1))}
                        disabled={currentMonthIdx === ACADEMIC_MONTHS.length - 1}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Highly Styled Month Grid */}
                    <MonthGrid
                      meta={activeMonthMeta}
                      events={events}
                      schoolWeek={schoolWeek}
                      selectedDate={selectedDate}
                      onDateClick={(dateStr) => {
                        setSelectedDate(dateStr);
                      }}
                    />

                    {/* Bottom notes in Monthly View */}
                    <div className="flex gap-2.5 rounded-xl bg-amber-50/50 border border-amber-100 p-4 text-[11px] text-amber-800 leading-normal print:hidden">
                      <Info className="h-4 w-4 shrink-0 text-amber-500" />
                      <p>
                        <strong>Petunjuk Navigasi:</strong> Klik pada salah satu kotak tanggal di kalender ganjil/genap untuk melihat detail kegiatan dan membuat agenda khusus pada tanggal tersebut.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 2. VIEW MODE: TAHUNAN */}
                {viewMode === 'tahunan' && (
                  <motion.div
                    key="view-tahunan"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {ACADEMIC_MONTHS.map((mMeta, idx) => (
                      <MonthGrid
                        key={`mini-${idx}`}
                        meta={mMeta}
                        events={events}
                        schoolWeek={schoolWeek}
                        mini={true}
                        onMonthFocus={handleMonthFocus}
                      />
                    ))}
                  </motion.div>
                )}

                {/* 3. VIEW MODE: DAFTAR AGENDA */}
                {viewMode === 'agenda' && (
                  <motion.div
                    key="view-agenda"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Filtering Panel */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 print:hidden">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        
                        {/* Search Input */}
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Cari kegiatan sekolah..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-400 bg-slate-50/50"
                          />
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        </div>

                        {/* Category Dropdown */}
                        <div className="flex flex-wrap items-center gap-3">
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as EventCategory | 'semua')}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                          >
                            <option value="semua">Semua Kategori</option>
                            {Object.entries(CATEGORY_SPECS).map(([kKey, spec]) => (
                              <option key={kKey} value={kKey}>
                                {spec.label}
                              </option>
                            ))}
                          </select>

                          {/* Semester Toggle Filter */}
                          <div className="flex items-center rounded-xl bg-slate-100 p-1">
                            <button
                              onClick={() => setFilterSemester('semua')}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                                filterSemester === 'semua' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                              }`}
                            >
                              Semua
                            </button>
                            <button
                              onClick={() => setFilterSemester(1)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                                filterSemester === 1 ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                              }`}
                            >
                              Smt 1
                            </button>
                            <button
                              onClick={() => setFilterSemester(2)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                                filterSemester === 2 ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                              }`}
                            >
                              Smt 2
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Table List of Events */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                      {filteredEventsForAgenda.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                          <CalendarDays className="mx-auto h-12 w-12 text-slate-300 stroke-[1.5px]" />
                          <p className="mt-4 text-xs font-bold text-slate-700">Tidak ada kegiatan ditemukan</p>
                          <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter kategori.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 uppercase font-semibold tracking-wider text-[10px]">
                                <th className="py-3 px-4">Agenda / Kegiatan</th>
                                <th className="py-3 px-2">Tanggal Pelaksanaan</th>
                                <th className="py-3 px-2">Kategori</th>
                                <th className="py-3 px-2 text-center">Semester</th>
                                <th className="py-3 px-2 text-center">Libur?</th>
                                <th className="py-3 px-4 text-right print:hidden">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredEventsForAgenda.map((evt) => {
                                const spec = CATEGORY_SPECS[evt.category];
                                const formattedDate =
                                  evt.startDate === evt.endDate
                                    ? new Date(evt.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : `${new Date(evt.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} s/d ${new Date(evt.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

                                return (
                                  <tr key={evt.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                                      <p className="font-bold text-slate-950">{evt.title}</p>
                                      {evt.description && (
                                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-2">
                                          {evt.description}
                                        </p>
                                      )}
                                    </td>
                                    
                                    <td className="py-3.5 px-2 font-semibold text-slate-700">
                                      {formattedDate}
                                    </td>

                                    <td className="py-3.5 px-2">
                                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${spec ? `${spec.bgClass} ${spec.borderClass}` : 'bg-slate-100 text-slate-800'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${spec ? spec.accentClass : 'bg-slate-500'}`} />
                                        {spec ? spec.label : evt.category}
                                      </span>
                                    </td>

                                    <td className="py-3.5 px-2 text-center font-mono font-bold text-slate-600">
                                      Smtr {evt.semester}
                                    </td>

                                    <td className="py-3.5 px-2 text-center">
                                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${evt.isHoliday ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>
                                        {evt.isHoliday ? 'Hari Libur' : 'Efektif'}
                                      </span>
                                    </td>

                                    <td className="py-3.5 px-4 text-right print:hidden">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => {
                                            setEditingEvent(evt);
                                            setIsFormOpen(true);
                                          }}
                                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-650 transition-colors cursor-pointer"
                                          title="Ubah Agenda"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            triggerConfirm(
                                              'Hapus Agenda Kegiatan',
                                              `Apakah Anda yakin ingin menghapus kegiatan "${evt.title}" dari kalender?`,
                                              () => handleDeleteEvent(evt.id)
                                            );
                                          }}
                                          className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer"
                                          title="Hapus Agenda"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. VIEW MODE: RINCIAN STATISTIK (RPE) */}
                {viewMode === 'statistik' && (
                  <motion.div
                    key="view-statistik"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StatsDetail
                      months={ACADEMIC_MONTHS}
                      events={events}
                      schoolWeek={schoolWeek}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: CALENDAR LEGEND, SPECIFIC DATE AGENDA & SYSTEM INFO */}
          <div className="col-span-1 space-y-6">
            
            {/* 1. DATE DETAILS BOX */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <h4 className="font-sans text-sm font-bold text-slate-800">
                    Agenda Terpilih
                  </h4>
                </div>
                
                {selectedDate && (
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {selectedDate}
                  </span>
                )}
              </div>

              {selectedDate ? (
                <div className="space-y-4">
                  
                  {/* Event list for selected date */}
                  {selectedDateEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-slate-500">
                      <p className="text-xs font-semibold text-slate-600">Hari Pembelajaran Efektif (KBM)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tidak bertepatan dengan libur atau acara sekolah khusus.</p>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setIsFormOpen(true);
                        }}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Rancang Agenda Sini</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map((evt) => {
                        const spec = CATEGORY_SPECS[evt.category];
                        return (
                          <div
                            key={evt.id}
                            className={`rounded-xl border p-4 space-y-2 transition-all ${
                              spec ? `${spec.bgClass} ${spec.borderClass}` : 'bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div>
                                <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                                  evt.isHoliday ? 'bg-red-500 text-white' : 'bg-white text-slate-800'
                                }`}>
                                  {evt.isHoliday ? 'Hari Libur' : 'Acara Sekolah'}
                                </span>
                                <h5 className="font-bold text-slate-900 mt-1">{evt.title}</h5>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setEditingEvent(evt);
                                    setIsFormOpen(true);
                                  }}
                                  className="rounded-lg p-1.5 bg-white/70 hover:bg-white text-slate-600 transition-colors cursor-pointer"
                                  title="Ubah Agenda"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    triggerConfirm('Hapus Agenda Kegiatan', `Apakah Anda yakin ingin menghapus kegiatan "${evt.title}" dari kalender?`, () => handleDeleteEvent(evt.id)); if (false) {
                                      handleDeleteEvent(evt.id);
                                    }
                                  }}
                                  className="rounded-lg p-1.5 bg-white/70 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Hapus Agenda"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {evt.description && (
                              <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                                {evt.description}
                              </p>
                            )}

                            <div className="text-[10px] font-mono opacity-80 pt-1 flex items-center justify-between">
                              <span>Mulai: {evt.startDate}</span>
                              <span>Sampai: {evt.endDate}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Fast button inside detail */}
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setIsFormOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4 text-slate-400" />
                        <span>Tambah Agenda Lain Sini</span>
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  Pilih salah satu tanggal di kalender ganjil/genap untuk meninjau kustomisasi agenda belajarnya.
                </p>
              )}
            </div>

            {/* 2. LEGEND / EVENT CATEGORIES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="h-5 w-5 text-indigo-500" />
                <h4 className="font-sans text-sm font-bold text-slate-800">
                  Legenda Kategori & Jenis Kegiatan
                </h4>
              </div>

              <div className="space-y-3.5">
                {Object.values(CATEGORY_SPECS).map((spec) => (
                  <div key={spec.id} className="flex items-start gap-3">
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full border border-white/20 ${spec.accentClass}`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">
                        {spec.label}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. INFO BOX (TAHUN AJARAN DETAILS) */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-5 space-y-3">
              <h5 className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-widest">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                Siklus Pembelajaran Sekolah
              </h5>
              
              <div className="text-[11px] leading-relaxed text-indigo-900/80 space-y-2">
                <p>
                  Siklus penanggalan pendidikan ini disusun berdasarkan acuan standar <strong>Tahun Pelajaran {academicYear}</strong> yang mencakup:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-650">
                  <li><strong>Semester Ganjil</strong>: 13 Juli 2026 s/d 18 Desember 2026</li>
                  <li><strong>Semester Genap</strong>: 4 Januari 2027 s/d 18 Juni 2027</li>
                  <li><strong>Libur Pokok</strong>: Libur Semester Ganjil, Libur Akhir Tahun Ajaran, dan Hari Libur Nasional (Hari Raya Idul Fitri, Isra Mi&apos;raj, Waisak, dll.)</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-150 bg-white py-8 text-center text-xs text-slate-400 print:hidden">
        <p className="font-medium">
          © {new Date().getFullYear()} Aplikasi Kalender Pendidikan Interaktif. Seluruh Hak Cipta Dilindungi.
        </p>
        <p className="mt-1 text-[11px] text-slate-400 font-mono">
          Dirancang responsif dan elegan dengan standard data KBM & Libur Nasional TA {academicYear}.
        </p>
      </footer>

      {/* FLOATING ACTION PRINT DIALOG/PREVIEW OVERLAY (ONLY VISIBLE ON PRINT) */}
      <div className="hidden print:block p-8 bg-white text-black space-y-8">
        <div className="text-center space-y-2">
          {schoolLogo && (
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 p-1 border border-slate-350 rounded-xl">
                <img src={schoolLogo} alt="Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}
          <h1 className="font-extrabold text-3xl tracking-tight uppercase">{schoolName}</h1>
          <h2 className="text-lg font-bold text-slate-700">KALENDER PENDIDIKAN - TAHUN PELAJARAN {academicYear}</h2>
          <h3 className="text-sm font-semibold text-slate-500">KOTA/KAB. {schoolCity} ({schoolWeek}-HARI SEKOLAH)</h3>
          <div className="h-[2px] bg-black w-full my-4" />
        </div>

        {/* All months grid */}
        <div className="grid grid-cols-2 gap-6">
          {ACADEMIC_MONTHS.map((mMeta, idx) => (
            <MonthGrid
              key={`print-mini-${idx}`}
              meta={mMeta}
              events={events}
              schoolWeek={schoolWeek}
              mini={true}
            />
          ))}
        </div>

        {/* Legend block on print */}
        <div className="page-break-before mt-8 border border-slate-350 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm uppercase">Keterangan / Rujukan Kalender Pendidikan</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            {Object.values(CATEGORY_SPECS).map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full border border-slate-400 ${spec.accentClass}`} />
                <span className="font-semibold text-slate-800">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EVENT FORM FORM OVERLAY DRAWERS */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleAddEvent}
        initialEvent={editingEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
      />

      {/* SCHOOL PROFILES & SETTINGS DIALOG */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        academicYear={academicYear}
        schoolName={schoolName}
        schoolCity={schoolCity}
        schoolLogo={schoolLogo}
        onSave={(settings) => {
          setAcademicYear(settings.academicYear);
          setSchoolName(settings.schoolName);
          setSchoolCity(settings.schoolCity);
          setSchoolLogo(settings.schoolLogo);
        }}
      />

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        events={events}
        schoolWeek={schoolWeek}
        schoolName={schoolName}
        academicYear={academicYear}
        schoolCity={schoolCity}
        schoolLogo={schoolLogo}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        isDanger={confirmState.isDanger}
      />
    </div>
  );
}
