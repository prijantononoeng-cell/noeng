/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AcademicEvent, MonthMeta } from '../types';
import { CATEGORY_SPECS, isWeekend, HARI_NAMA_PENDEK } from '../data';

interface MonthGridProps {
  meta: MonthMeta;
  events: AcademicEvent[];
  schoolWeek: '5' | '6';
  mini?: boolean; // Jika true, render minimalis untuk ringkasan tahunan
  selectedDate?: string | null;
  onDateClick?: (dateStr: string) => void;
  onMonthFocus?: (monthIndex: number) => void; // Ketika mini card diklik
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  meta,
  events,
  schoolWeek,
  mini = false,
  selectedDate,
  onDateClick,
  onMonthFocus,
}) => {
  const { year, month, name: monthName, totalDays } = meta;

  // Dapatkan index hari pertama dalam sebulan
  // Di Javascript, getDay() -> 0 = Minggu, 1 = Senin, dst
  // Kita ingin urutan kolom: Senin (1), Selasa (2), Rabu (3), Kamis (4), Jumat (5), Sabtu (6), Minggu (0)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Sesuaikan agar Senin berada di index 0
  // Jika getDay() = 0 (Minggu), kita ingin menjadikannya index 6
  // Jika getDay() = 1 (Senin), kita ingin menjadikannya index 0, dst
  const paddingOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Render header hari (Sen, Sel, Rab, Kam, Jum, Sab, Min)
  // Untuk mini, kita sesuaikan urutan letak kolom
  const columns = ['Sen', 'Sel', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  // Karena 'Sel' ganda di array di atas, mari benerin penulisan singkat
  const headerDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  // Dapatkan semua tanggal dalam bulan ini
  const daysInMonth: { dayNum: number; dateStr: string; weekend: boolean; holidayEvents: AcademicEvent[]; normalEvents: AcademicEvent[] }[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const mmStr = String(month + 1).padStart(2, '0');
    const ddStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mmStr}-${ddStr}`;
    const weekend = isWeekend(dateStr, schoolWeek);

    // Cari event yang aktif pada tanggal ini
    const dayEvents = events.filter((evt) => {
      return dateStr >= evt.startDate && dateStr <= evt.endDate;
    });

    const holidayEvents = dayEvents.filter(e => e.isHoliday);
    const normalEvents = dayEvents.filter(e => !e.isHoliday);

    daysInMonth.push({
      dayNum: d,
      dateStr,
      weekend,
      holidayEvents,
      normalEvents,
    });
  }

  // Hitung jumlah hari belajar efektif dalam bulan ini
  const effectiveLearningDays = daysInMonth.filter((d) => {
    return !d.weekend && d.holidayEvents.length === 0;
  }).length;

  return (
    <div
      onClick={() => mini && onMonthFocus && onMonthFocus(month)}
      className={`rounded-2xl border bg-white shadow-xs transition-all duration-300 ${
        mini
          ? 'border-slate-100 p-4 hover:border-indigo-200 hover:shadow-md cursor-pointer'
          : 'border-slate-200 p-6'
      }`}
    >
      {/* Header Bulan */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className={`font-sans font-bold text-slate-800 ${mini ? 'text-sm' : 'text-lg'}`}>
            {monthName} {year}
          </h4>
          <p className="text-[10px] text-slate-400">
            Semester {meta.semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}
          </p>
        </div>
        
        <span
          className={`rounded-lg font-mono text-xs font-bold leading-none ${
            effectiveLearningDays > 15
              ? 'bg-emerald-50 text-emerald-700'
              : effectiveLearningDays > 10
              ? 'bg-amber-50 text-amber-700'
              : 'bg-red-50 text-red-700'
          } ${mini ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5'}`}
          title="Hari Belajar Efektif (KBM)"
        >
          {effectiveLearningDays} RBE <span className="hidden md:inline font-sans text-[10px] font-normal">Hari Efektif</span>
        </span>
      </div>

      {/* Grid Kalender */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Nama Hari */}
        {headerDays.map((day, idx) => {
          const isRed = idx === 6 || (schoolWeek === '5' && idx === 5);
          return (
            <div
              key={idx}
              className={`font-semibold tracking-wide uppercase ${
                mini ? 'text-[9px] py-0.5' : 'text-xs py-1'
              } ${isRed ? 'text-red-500' : 'text-slate-400'}`}
            >
              {mini ? day[0] : day}
            </div>
          );
        })}

        {/* Padding Kosong Awal Bulan */}
        {Array.from({ length: paddingOffset }).map((_, idx) => (
          <div key={`pad-${idx}`} className={`aspect-square opacity-0`} />
        ))}

        {/* Sel Tanggal */}
        {daysInMonth.map(({ dayNum, dateStr, weekend, holidayEvents, normalEvents }) => {
          const isSelected = selectedDate === dateStr;
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          
          // Memiliki event libur
          const hasHoliday = holidayEvents.length > 0;
          // Memiliki event non-libur
          const hasEvents = normalEvents.length > 0;
          
          // Warna teks berdasarkan status hari
          let dayTextColor = 'text-slate-700';
          if (weekend) {
            dayTextColor = 'text-red-500 font-medium';
          } else if (hasHoliday) {
            dayTextColor = 'text-rose-600 font-bold';
          }

          // Background dan styling jika sel ini aktif
          return (
            <div
              key={dateStr}
              onClick={(e) => {
                if (mini) return; // Mini mode is disabled from clicking date cells to add events
                e.stopPropagation();
                onDateClick && onDateClick(dateStr);
              }}
              className={`group relative flex aspect-square flex-col justify-between rounded-xl p-1 transition-all duration-150 ${
                mini
                  ? 'cursor-pointer border-0'
                  : 'cursor-pointer border border-slate-50 hover:border-slate-250 hover:bg-slate-50/70'
              } ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600/20'
                  : ''
              } ${
                isToday && !isSelected
                  ? 'border-red-400 bg-red-50/40'
                  : ''
              }`}
              title={
                !mini
                  ? `${dayNum} ${monthName} ${year} | ${
                      hasHoliday
                        ? holidayEvents.map((e) => e.title).join(', ')
                        : hasEvents
                        ? normalEvents.map((e) => e.title).join(', ')
                        : 'Hari Belajar Efektif'
                    }`
                  : undefined
              }
            >
              {/* Nomor Hari */}
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-md font-sans text-xs font-semibold ${
                    isToday
                      ? 'bg-red-500 text-white shadow-xs'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : dayTextColor
                  } ${mini ? 'mx-auto' : ''}`}
                >
                  {dayNum}
                </span>

                {/* Indikator Belajar Efektif (Hanya untuk Non-Mini) */}
                {!mini && !weekend && !hasHoliday && (
                  <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-60" title="Hari Efektif Belajar" />
                )}
              </div>

              {/* Tampilan Visual Unsur Kegiatan */}
              {mini ? (
                // Untuk Mini Mode: Cukup link titik warna sebagai indikator
                <div className="mt-auto flex justify-center gap-0.5 pb-0.5">
                  {holidayEvents.slice(0, 2).map((evt) => {
                    const colorSpec = CATEGORY_SPECS[evt.category];
                    return (
                      <span
                        key={evt.id}
                        className={`h-1.5 w-1.5 rounded-full ${colorSpec ? colorSpec.accentClass : 'bg-rose-500'}`}
                      />
                    );
                  })}
                  {normalEvents.slice(0, 2).map((evt) => {
                    const colorSpec = CATEGORY_SPECS[evt.category];
                    return (
                      <span
                        key={evt.id}
                        className={`h-1.5 w-1.5 rounded-full ${colorSpec ? colorSpec.accentClass : 'bg-emerald-500'}`}
                      />
                    );
                  })}
                </div>
              ) : (
                // Untuk Large Mode: Tampilkan detail event / text capsule jika muat, jika tidak, titik-titik trendi
                <div className="mt-1 flex flex-col gap-0.5 overflow-hidden">
                  {/* Gabungkan semua event pada hari ini */}
                  {holidayEvents.concat(normalEvents).slice(0, 2).map((evt) => {
                    const colorSpec = CATEGORY_SPECS[evt.category];
                    return (
                      <div
                        key={evt.id}
                        className={`truncate rounded px-1 text-[9px] font-bold leading-normal border ${
                          colorSpec
                            ? `${colorSpec.bgClass} ${colorSpec.borderClass}`
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {evt.title}
                      </div>
                    );
                  })}
                  {/* Indikator Jika Event Lebih dari 2 */}
                  {holidayEvents.concat(normalEvents).length > 2 && (
                    <span className="text-[8px] font-extrabold text-slate-400 pl-1">
                      +{holidayEvents.concat(normalEvents).length - 2} acara lagi
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
