/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, FileText, Check, AlertCircle, Trash2, Tag, BookOpen } from 'lucide-react';
import { AcademicEvent, EventCategory } from '../types';
import { CATEGORY_SPECS } from '../data';
import { ConfirmDialog } from './ConfirmDialog';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<AcademicEvent, 'id'> & { id?: string }) => void;
  initialEvent?: AcademicEvent | null;
  onDelete?: (id: string) => void;
  selectedDate?: string | null; // Pre-filled date when clicking a day
}

export const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
  onDelete,
  selectedDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<EventCategory>('pembelajaran');
  const [semester, setSemester] = useState<1 | 2>(1);
  const [isHoliday, setIsHoliday] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Sinc ketika edit atau klik tanggal baru
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || '');
      setStartDate(initialEvent.startDate);
      setEndDate(initialEvent.endDate);
      setCategory(initialEvent.category);
      setSemester(initialEvent.semester);
      setIsHoliday(initialEvent.isHoliday);
      setError('');
    } else {
      setTitle('');
      setDescription('');
      const defaultDate = selectedDate || new Date().toISOString().split('T')[0];
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setCategory('pembelajaran');
      setSemester(determineSemester(defaultDate));
      setIsHoliday(false);
      setError('');
    }
  }, [initialEvent, selectedDate, isOpen]);

  // Sangat berguna untuk secara otomatis menyesuaikan nilai isHoliday berdasarkan kategori yang dipilih
  const handleCategoryChange = (cat: EventCategory) => {
    setCategory(cat);
    
    // Auto-check isHoliday jika kategori adalah tipe liburan
    if (cat === 'libur_nasional' || cat === 'libur_semester') {
      setIsHoliday(true);
    } else {
      setIsHoliday(false);
    }
  };

  // Secara otomatis mendeteksi semester berdasarkan bulan tanggal mulai
  const handleStartDateChange = (dateVal: string) => {
    setStartDate(dateVal);
    // Jika tanggal akhir lebih kecil atau sama, selaraskan
    if (!endDate || endDate < dateVal) {
      setEndDate(dateVal);
    }
    setSemester(determineSemester(dateVal));
  };

  const determineSemester = (dateStr: string): 1 | 2 => {
    if (!dateStr) return 1;
    const month = new Date(dateStr).getMonth(); // 0-based
    // Sekolah Indonesia: Ganjil (Juli - Desember: Bulan 6 - 11), Genap (Januari - Juni: Bulan 0 - 5)
    return month >= 6 && month <= 11 ? 1 : 2;
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Nama kegiatan tidak boleh kosong.');
      return;
    }
    if (!startDate) {
      setError('Tanggal mulai harus diisi.');
      return;
    }
    if (!endDate) {
      setError('Tanggal akhir harus diisi.');
      return;
    }
    if (endDate < startDate) {
      setError('Tanggal akhir tidak boleh lebih awal dari tanggal mulai.');
      return;
    }

    onSubmit({
      id: initialEvent?.id,
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      category,
      semester,
      isHoliday,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Panel Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative z-10 flex h-full w-full flex-col bg-white shadow-2xl md:max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h3 className="font-sans text-lg font-bold text-slate-800">
                {initialEvent ? 'Edit Kegiatan Belajar' : 'Tambah Kegiatan Academic'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialEvent ? 'Perbarui agenda dan ubah status hari akademik.' : 'Buat jadwal kegiatan edukasi baru.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Scrollable Area */}
          <form onSubmit={onFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Nama Kegiatan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Nama Kegiatan *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sumatif Tengah Semester Ganjil"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all/300 bg-slate-50/50"
                />
                <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Kategori Kegiatan
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(CATEGORY_SPECS).map((spec) => {
                  const isSelected = category === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => handleCategoryChange(spec.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `border-slate-800 ring-1 ring-slate-800 ${spec.bgClass}`
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-white/20 ${spec.accentClass}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{spec.label}</p>
                        <p className="text-[11px] text-slate-500 leading-normal">{spec.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rentang Tanggal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Sistem Sekolah info: Semester dan Holiday toggle */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  Semester Ajaran:
                </span>
                <span className="rounded-full bg-slate-200 px-3 py-0.5 text-[11px] font-bold text-slate-800">
                  Semester {semester} ({semester === 1 ? 'Ganjil' : 'Genap'})
                </span>
              </div>

              <div className="h-[1px] bg-slate-100" />

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <div className="relative mt-0.5 flex items-center">
                  <input
                    type="checkbox"
                    checked={isHoliday}
                    onChange={(e) => setIsHoliday(e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer rounded-md border border-slate-300 text-indigo-600 checked:border-indigo-600 focus:ring-indigo-500"
                  />
                  {isHoliday && (
                    <Check className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 text-indigo-600 stroke-[3px]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700">Libur Sekolah?</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Mengurangi jumlah &quot;Hari Belajar Efektif&quot; (hari wajib KBM) pada penghitungan kalender.
                  </p>
                </div>
              </label>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Keterangan / Deskripsi
              </label>
              <div className="relative">
                <textarea
                  placeholder="Masukkan rincian informasi kegiatan sekolah..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 resize-y"
                />
                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </form>

          {/* Action Footer */}
          <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 p-5">
            {initialEvent && onDelete && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              onClick={onFormSubmit}
              type="submit"
              className="flex-2 rounded-xl bg-indigo-600 py-2.5 text-center text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-md transition-all cursor-pointer"
            >
              Simpan Agenda
            </button>
          </div>
        </motion.div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Hapus Agenda Kegiatan"
        message={`Apakah Anda yakin ingin menghapus kegiatan "${initialEvent?.title || ''}" dari kalender?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (initialEvent && onDelete) {
            onDelete(initialEvent.id);
          }
          setShowConfirmDelete(false);
          onClose();
        }}
        onCancel={() => setShowConfirmDelete(false)}
        isDanger={true}
      />
    </AnimatePresence>
  );
};
