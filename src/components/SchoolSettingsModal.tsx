/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Calendar, 
  MapPin, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear: string;
  schoolName: string;
  schoolCity: string;
  schoolLogo: string | null;
  onSave: (settings: {
    academicYear: string;
    schoolName: string;
    schoolCity: string;
    schoolLogo: string | null;
  }) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  academicYear: initialAcademicYear,
  schoolName: initialSchoolName,
  schoolCity: initialSchoolCity,
  schoolLogo: initialSchoolLogo,
  onSave,
}) => {
  const [academicYear, setAcademicYear] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>('');
  
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props when open/changed
  useEffect(() => {
    if (isOpen) {
      setAcademicYear(initialAcademicYear);
      setSchoolName(initialSchoolName);
      setSchoolCity(initialSchoolCity);
      setSchoolLogo(initialSchoolLogo);
      setLogoName(initialSchoolLogo ? 'logo_sekolah.png' : '');
      setError('');
    }
  }, [isOpen, initialAcademicYear, initialSchoolName, initialSchoolCity, initialSchoolLogo]);

  // Handle Drag & Drop Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const max_size = 128; // Resize to 128x128 for storage optimization
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
          } else {
            // Fallback to normal loading if canvas fails
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => {
          reject(new Error('Format file gambar tidak valid.'));
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Gagal membaca file gambar.'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Harap unggah file berformat gambar (PNG, JPG, WEBP).');
      return;
    }
    
    try {
      const resizedDataUrl = await resizeImage(file);
      setSchoolLogo(resizedDataUrl);
      setLogoName(file.name);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Gagal memproses gambar logo.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileProcess(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = () => {
    setSchoolLogo(null);
    setLogoName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      setError('Nama sekolah tidak boleh kosong.');
      return;
    }
    if (!academicYear.trim()) {
      setError('Tahun pelajaran tidak boleh kosong.');
      return;
    }
    if (!schoolCity.trim()) {
      setError('Nama kota atau kabupaten tidak boleh kosong.');
      return;
    }

    onSave({
      academicYear: academicYear.trim(),
      schoolName: schoolName.trim(),
      schoolCity: schoolCity.trim(),
      schoolLogo: schoolLogo,
    });
    onClose();
  };

  const handleQuickAySet = (year: string) => {
    setAcademicYear(year);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-100 bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
                <Building2 className="h-4 w-4" />
              </div>
              <h2 className="font-sans text-base font-bold text-slate-800">
                Pengaturan Profil & Identitas Sekolah
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Content & Actions */}
          <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden max-h-[85vh]">
            <div className="p-6 space-y-5 overflow-y-auto">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-650" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nama Sekolah */}
              <div className="space-y-1.5">
                <label htmlFor="schoolName" className="text-xs font-bold text-slate-650 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                  Nama Sekolah
                </label>
                <input
                  id="schoolName"
                  type="text"
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              {/* Tahun Pelajaran */}
              <div className="space-y-1.5">
                <label htmlFor="academicYear" className="text-xs font-bold text-slate-650 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  Tahun Ajaran / Pelajaran
                </label>
                <input
                  id="academicYear"
                  type="text"
                  placeholder="Contoh: 2026/2027"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
                {/* Quick suggestions */}
                <div className="flex items-center gap-2 pt-1 text-slate-400 text-[10px] font-bold">
                  <span>Pilih Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickAySet('2025/2026')}
                    className={`rounded-md px-2 py-0.5 border ${academicYear === '2025/2026' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    2025/2026
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAySet('2026/2027')}
                    className={`rounded-md px-2 py-0.5 border ${academicYear === '2026/2027' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    2026/2027
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAySet('2027/2028')}
                    className={`rounded-md px-2 py-0.5 border ${academicYear === '2027/2028' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    2027/2028
                  </button>
                </div>
              </div>

              {/* Kota atau Kabupaten */}
              <div className="space-y-1.5">
                <label htmlFor="schoolCity" className="text-xs font-bold text-slate-650 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  Nama Kota atau Kabupaten
                </label>
                <input
                  id="schoolCity"
                  type="text"
                  placeholder="Contoh: Jakarta Pusat"
                  value={schoolCity}
                  onChange={(e) => setSchoolCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              {/* Upload Logo Sekolah */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-650 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                    Logo Sekolah
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 rounded-md px-2 py-0.5 uppercase tracking-wider font-sans">
                    Opsional
                  </span>
                </label>
                
                <div className="flex gap-4 items-center">
                  {/* Logo Preview Container */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 overflow-hidden relative group">
                    {schoolLogo ? (
                      <>
                        <img 
                          src={schoolLogo} 
                          alt="Logo Sekolah Preview" 
                          className="h-full w-full object-contain p-1.5"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute inset-0 bg-red-650/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                          title="Hapus Logo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <Building2 className="h-5 w-5 text-slate-300" />
                        <span className="text-[8px] text-slate-400 font-bold mt-1">Kosong</span>
                      </div>
                    )}
                  </div>

                  {/* Dropzone Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl p-4 transition-colors text-center cursor-pointer ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50/30' 
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                    onClick={handleButtonClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <p className="text-[11px] font-bold text-slate-600">
                      Seret & letakkan gambar di sini, atau <span className="text-indigo-650 hover:underline">pilih file</span>
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                      Boleh dikosongkan. Mendukung PNG, JPG, atau WEBP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-650 hover:bg-slate-50 hover:border-slate-350 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-center text-xs font-bold text-white shadow-xs hover:shadow-md transition-all cursor-pointer py-2.5"
              >
                Simpan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
