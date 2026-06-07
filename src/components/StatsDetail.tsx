/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AcademicEvent, MonthMeta } from '../types';
import { countMonthlyDays } from '../data';
import { Calendar, Percent, BookOpen } from 'lucide-react';

interface StatsDetailProps {
  months: MonthMeta[];
  events: AcademicEvent[];
  schoolWeek: '5' | '6';
}

export const StatsDetail: React.FC<StatsDetailProps> = ({
  months,
  events,
  schoolWeek,
}) => {
  // Hitung detail bulanan
  const monthlyStats = months.map((m) => {
    const { calendarDays, holidays, effectiveDays } = countMonthlyDays(
      m.year,
      m.month,
      events,
      schoolWeek
    );

    // Hitung persentase efektifitas
    const efficiencyRate = calendarDays > 0 ? ((effectiveDays / calendarDays) * 100).toFixed(0) : '0';

    return {
      name: m.name,
      year: m.year,
      semester: m.semester,
      calendarDays,
      holidays,
      effectiveDays,
      efficiencyRate,
    };
  });

  // Hitung total keseluruhan
  const totalCalendarDays = monthlyStats.reduce((sum, item) => sum + item.calendarDays, 0);
  const totalHolidays = monthlyStats.reduce((sum, item) => sum + item.holidays, 0);
  const totalEffectiveDays = monthlyStats.reduce((sum, item) => sum + item.effectiveDays, 0);
  const avgEfficiency = totalCalendarDays > 0 ? ((totalEffectiveDays / totalCalendarDays) * 100).toFixed(1) : '0';

  // Hitung rincian per semester
  const sem1Stats = monthlyStats.filter(s => s.semester === 1);
  const sem2Stats = monthlyStats.filter(s => s.semester === 2);

  const sem1Effective = sem1Stats.reduce((sum, item) => sum + item.effectiveDays, 0);
  const sem2Effective = sem2Stats.reduce((sum, item) => sum + item.effectiveDays, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h4 className="font-sans text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Analisis Rincian Hari Efektif Belajar
          </h4>
          <p className="text-xs text-slate-500">
            Penghitungan hari KBM wajib untuk penyusunan prota/promes mengacu sistem sekolah {schoolWeek} hari.
          </p>
        </div>
      </div>

      {/* Rangkuman Semester */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-indigo-50/50 border border-indigo-100/30 p-4 space-y-1">
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Semester 1 (Ganjil)
          </p>
          <p className="font-mono text-xl font-black text-indigo-900">
            {sem1Effective} <span className="text-xs font-normal font-sans text-indigo-600">Hari Pembelajaran Efektif</span>
          </p>
          <div className="h-1 w-full bg-indigo-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: `${(sem1Effective / 180) * 100}%` }} />
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50/50 border border-emerald-100/30 p-4 space-y-1">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            Semester 2 (Genap)
          </p>
          <p className="font-mono text-xl font-black text-emerald-950">
            {sem2Effective} <span className="text-xs font-normal font-sans text-emerald-600">Hari Pembelajaran Efektif</span>
          </p>
          <div className="h-1 w-full bg-emerald-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(sem2Effective / 180) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Tabel Rincian */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Bulan ({schoolWeek} Hari Sekolah)</th>
              <th className="py-2.5 px-2 text-center">Hari Kalender</th>
              <th className="py-2.5 px-2 text-center">Weekend / Libur</th>
              <th className="py-2.5 px-2 text-center text-emerald-700 font-bold bg-emerald-50/20">Hari KBM Efektif</th>
              <th className="py-2.5 px-2 text-right">Rasio Efektif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {monthlyStats.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-[10px] text-slate-400 pl-1">Semester {item.semester}</span>
                </td>
                <td className="py-3 px-2 text-center font-mono text-slate-600">{item.calendarDays}</td>
                <td className="py-3 px-2 text-center font-mono text-rose-500">{item.holidays}</td>
                <td className="py-3 px-2 text-center font-mono text-emerald-600 font-extrabold bg-emerald-50/25">
                  {item.effectiveDays}
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-500">{item.efficiencyRate}%</td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="border-t border-slate-200 bg-slate-50/80 font-bold">
              <td className="py-3.5 px-3 text-slate-800 font-bold uppercase tracking-wider text-[10px]">
                Total 1 Tahun Ajaran
              </td>
              <td className="py-3.5 px-2 text-center font-mono text-slate-700">{totalCalendarDays}</td>
              <td className="py-3.5 px-2 text-center font-mono text-rose-600">{totalHolidays}</td>
              <td className="py-3.5 px-2 text-center font-mono text-emerald-700 font-black bg-emerald-50/55">
                {totalEffectiveDays}
              </td>
              <td className="py-3.5 px-2 text-right font-mono text-slate-700">{avgEfficiency}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Warning */}
      <div className="flex gap-2.5 rounded-xl bg-indigo-50/40 border border-indigo-150 p-4 text-[11px] leading-relaxed text-indigo-700">
        <Percent className="h-4 w-4 shrink-0 mt-0.5 text-indigo-500" />
        <p>
          <strong>Informasi Rumus Rencana Pekan Efektif (RPE)</strong>: RBE (Rencana Belajar Efektif) dihitung dengan mengurangi total hari kalender sebulan dengan total hari Minggu/Sabtu (berdasarkan pilihan sistem {schoolWeek}-hari sekolah) beserta agenda nasional/semester berkategori libur resmi.
        </p>
      </div>
    </div>
  );
};
