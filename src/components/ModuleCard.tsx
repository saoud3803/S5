import React from 'react';
import Link from 'next/link';
import { ModuleData } from '@/types/resources';
import { getModuleIcon } from '@/lib/icons';
import { ArrowRight, Files, User, Clock } from 'lucide-react';

interface ModuleCardProps {
  module: ModuleData;
}

const CATEGORY_ORDER = [
  'Cours',
  'TP',
  'TD',
  'Projets',
  'Examens',
  'Corriges',
  'Autres'
];

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const IconComponent = getModuleIcon(module.icon);

  // Sort categories according to requested order
  const sortedCategories = [...module.categoriesList].sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a.key);
    const idxB = CATEGORY_ORDER.indexOf(b.key);
    const orderA = idxA === -1 ? 99 : idxA;
    const orderB = idxB === -1 ? 99 : idxB;
    return orderA - orderB;
  });

  return (
    <Link
      href={`/module/${module.slug}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${module.color} opacity-90`} />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.bgLight} ${module.borderLight} border ${module.accent} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
            <IconComponent size={24} strokeWidth={2.2} />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Files size={13} className="text-slate-400" />
            <span>{module.totalFiles} docs</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
          {module.name}
        </h3>

        {/* Professor & Schedule badges */}
        <div className="space-y-1.5 mb-3">
          {module.professor && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <User size={13} className="text-blue-500 flex-shrink-0" />
              <span className="truncate">{module.professor}</span>
            </div>
          )}
          {module.schedule && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <Clock size={12} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{module.schedule}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {module.description}
        </p>
      </div>

      <div>
        {/* Categories preview in requested order */}
        <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {sortedCategories.length > 0 ? (
            sortedCategories.slice(0, 3).map((cat) => (
              <span
                key={cat.key}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                {cat.name} ({cat.count})
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-400 italic">Dossier prêt pour vos cours</span>
          )}
          {sortedCategories.length > 3 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
              +{sortedCategories.length - 3}
            </span>
          )}
        </div>

        {/* Footer action */}
        <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          <span>Accéder aux ressources</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};
