/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  bgGradient: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  bgGradient,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br ${bgGradient} p-5 shadow-sm transition-all duration-300 md:p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </p>
          <h3 className="font-sans text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
            {value}
          </h3>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
        <div className={`rounded-xl p-3 bg-white/80 shadow-sm backdrop-blur-sm ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative accent lines */}
      <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />
    </motion.div>
  );
};
