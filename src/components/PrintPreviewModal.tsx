/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  FileText, 
  Info, 
  Settings, 
  Check, 
  AlertTriangle,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { AcademicEvent } from '../types';
import { ACADEMIC_MONTHS, CATEGORY_SPECS } from '../data';
import { MonthGrid } from './MonthGrid';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: AcademicEvent[];
  schoolWeek: '5' | '6';
  schoolName: string;
  academicYear: string;
  schoolCity: string;
  schoolLogo: string | null;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  events,
  schoolWeek,
  schoolName,
  academicYear,
  schoolCity,
  schoolLogo,
}) => {
  const [printLayout, setPrintLayout] = useState<'potret' | 'lanskap'>('lanskap');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error("Print failed:", e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-md p-4 md:p-6 lg:p-8 overflow-y-auto print:hidden">
        {/* Modal Outer Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="mx-auto w-full max-w-7xl rounded-2xl bg-slate-100 flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-sans text-base font-extrabold text-slate-900 leading-tight">
                  Pratinjau & Panduan Cetak Kalender
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tahun Pelajaran {academicYear} • {schoolName}
                </p>
              </div>
            </div>

            {/* Actions & Close */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold text-slate-600">
                <span className="px-2 text-[10px] text-slate-400 uppercase tracking-wider">Format:</span>
                <button
                  onClick={() => setPrintLayout('lanskap')}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    printLayout === 'lanskap' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Lanskap (Kanan-Kiri)
                </button>
                <button
                  onClick={() => setPrintLayout('potret')}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    printLayout === 'potret' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Potret (Atas-Bawah)
                </button>
              </div>

              {/* Main Print Trigger */}
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Mulai Cetak
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Tutup Pratinjau"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Inner Workspace Split */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0 bg-slate-100 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* LEFT COLUMN: GUIDELINES & STEPS */}
            <div className="w-full lg:w-96 p-6 overflow-y-auto space-y-6 shrink-0 bg-white">
              {/* Warning/Tips Box */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wide">
                    Penting: Kendala Cetak Iframe Browser
                  </h4>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
                  Aplikasi ini berjalan di dalam kotak aman (iframe) Google AI Studio. Beberapa browser memblokir tombol <b>"Mulai Cetak"</b> agar tidak membuka dialog cetak secara otomatis demi keamanan.
                </p>
                <div className="border-t border-amber-200/60 pt-2.5 space-y-2">
                  <p className="text-[11px] font-bold text-amber-900">
                    Solusi manual jika tombol cetak tidak berespon:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-amber-800 space-y-1 font-medium pl-1">
                    <li>Klik di area kosong pada kalender di sebelah kanan.</li>
                    <li>Sambil melihat pratinjau, tekan tombol pintasan keyboard:
                      <div className="mt-1 font-mono text-[10px] bg-white border border-amber-200 py-1 px-1.5 rounded-lg inline-block text-slate-700 shadow-2xs">
                        Windows: <kbd className="font-bold">Ctrl + P</kbd>
                      </div>
                      <div className="mt-1 ml-1 font-mono text-[10px] bg-white border border-amber-200 py-1 px-1.5 rounded-lg inline-block text-slate-700 shadow-2xs">
                        Mac: <kbd className="font-bold">Cmd + P</kbd>
                      </div>
                    </li>
                    <li>Atau, klik kanan pada area kosong pratinjau dan pilih <b>Cetak (Print)</b>.</li>
                  </ol>
                </div>
              </div>

              {/* Print Best Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-950">
                  <Settings className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-705">
                    Rekomendasi Setelan Cetak (A4)
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="border-l-2 border-indigo-200 pl-3">
                    <p className="font-bold text-slate-800">1. Orientasi & Layout</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Pilih orientasi cetak <b>{printLayout === 'lanskap' ? 'Lanskap' : 'Potret'}</b> di setelan browser, sesuaikan dengan opsi format di atas.
                    </p>
                  </div>

                  <div className="border-l-2 border-indigo-200 pl-3">
                    <p className="font-bold text-slate-800">2. Aktifkan Latar Belakang (Wajib!)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Centang opsi <b>"Grafik Latar Belakang" (Background graphics / Background colors)</b> agar warna indikator liburan dan kegiatan di kalender ikut tercetak.
                    </p>
                  </div>

                  <div className="border-l-2 border-indigo-200 pl-3">
                    <p className="font-bold text-slate-800">3. Skala Dokumen</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Atur skala ke <b>CSS / 70% s.d. 80%</b> atau pilih <b>"Sesuaikan ke Halaman" (Fit to page / Shrink to fit)</b> agar seluruh 12 bulan rapi termuat dalam 1 halaman kertas A4.
                    </p>
                  </div>

                  <div className="border-l-2 border-indigo-200 pl-3">
                    <p className="font-bold text-slate-800">4. Margin</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Set margin dokumen ke <b>Minimum</b> atau <b>Tanpa Margin (None)</b> untuk mendapatkan ruang maksimal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Button */}
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 py-3 text-center text-xs font-extrabold text-slate-700 transition-colors cursor-pointer"
              >
                Kembali ke Aplikasi Utama
              </button>
            </div>

            {/* RIGHT COLUMN: LIVING INTERACTIVE DOCK (SIMULATED CANVAS PRINT VIEW) */}
            <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto flex items-start justify-center">
              
              {/* Simulated Paper A4 */}
              <div 
                ref={printAreaRef}
                className={`bg-white text-slate-900 p-8 shadow-xl border border-slate-250 transition-all duration-300 ${
                  printLayout === 'lanskap' 
                    ? 'w-full max-w-[1100px] aspect-[1.414/1]' 
                    : 'w-full max-w-[800px] aspect-[1/1.414]'
                }`}
                style={{ contentVisibility: 'auto' }}
              >
                {/* Paper Header */}
                <div className="flex flex-col items-center text-center space-y-2 pb-5 border-b border-slate-300">
                  {schoolLogo && (
                    <div className="h-14 w-14 p-1 border border-slate-250 rounded-xl bg-white flex items-center justify-center">
                      <img 
                        src={schoolLogo} 
                        alt="Logo" 
                        className="h-full w-full object-contain" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  )}
                  <h1 className="font-sans font-extrabold text-2xl tracking-tight uppercase text-slate-900">
                    {schoolName}
                  </h1>
                  <h2 className="text-sm font-bold text-slate-700 tracking-wide">
                    KALENDER PENDIDIKAN DAN KALENDER AKADEMIK
                  </h2>
                  <h3 className="text-xs font-semibold text-slate-500">
                    TAHUN AJARAN {academicYear} • KOTA/KABUPATEN {schoolCity} • SISTEM {schoolWeek} HARI SEKOLAH
                  </h3>
                </div>

                {/* Grid of months */}
                <div className={`grid gap-4 mt-6 ${
                  printLayout === 'lanskap' ? 'grid-cols-4' : 'grid-cols-3'
                }`}>
                  {ACADEMIC_MONTHS.map((mMeta, idx) => (
                    <div key={`print-prev-month-${idx}`} className="scale-[0.9] origin-top border border-slate-150 rounded-xl p-2.5 bg-slate-50/50">
                      <MonthGrid
                        meta={mMeta}
                        events={events}
                        schoolWeek={schoolWeek}
                        mini={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Custom reference panel legends */}
                <div className="mt-6 border border-slate-300 bg-white p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                    Indikator Program Utama & Libur Nasional
                  </h4>
                  <div className="grid grid-cols-4 gap-3.5 text-[10px]">
                    {Object.values(CATEGORY_SPECS).map((spec) => (
                      <div key={`legend-${spec.id}`} className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full border border-slate-350 shrink-0 ${spec.accentClass}`} />
                        <span className="font-bold text-slate-700 truncate">{spec.label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-md bg-red-400 border border-slate-300 shrink-0" />
                      <span className="font-bold text-slate-700">Hari Libur Mingguan</span>
                    </div>
                  </div>
                </div>

                {/* Signature Panel */}
                <div className="mt-8 flex justify-between items-end text-xs font-bold font-sans text-slate-800 px-4">
                  <div className="space-y-1 text-center">
                    <p className="text-slate-500 font-medium text-[10px] uppercase">Mengetahui,</p>
                    <p className="font-extrabold">Kepala Sekolah {schoolName}</p>
                    <div className="h-14" />
                    <p className="underline border-t border-slate-300 pt-1 px-4">___________________________</p>
                    <p className="text-[10px] text-slate-400 font-medium">NIP. ........................................</p>
                  </div>
                  
                  <div className="text-right space-y-1 text-center">
                    <p className="text-slate-500 font-medium text-[10px]">{schoolCity}, ........................... {new Date().getFullYear()}</p>
                    <p className="font-extrabold">Waka. Urusan Kurikulum</p>
                    <div className="h-14" />
                    <p className="underline border-t border-slate-300 pt-1 px-4">___________________________</p>
                    <p className="text-[10px] text-slate-400 font-medium">NIP. ........................................</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
