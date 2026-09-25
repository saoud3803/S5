import React from 'react';
import { ResourceCategory } from '@/types/resources';

interface CategoryFilterProps {
  categories: ResourceCategory[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
  totalFiles: number;
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

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  totalFiles,
}) => {
  // Sort categories according to requested order
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a.key);
    const idxB = CATEGORY_ORDER.indexOf(b.key);
    const orderA = idxA === -1 ? 99 : idxA;
    const orderB = idxB === -1 ? 99 : idxB;
    return orderA - orderB;
  });

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {/* Categories in exact requested order */}
      {sortedCategories.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                isActive
                  ? 'bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}

      {/* "Tous les documents" at the end */}
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
          activeCategory === 'ALL'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`}
      >
        <span>Tous les documents</span>
        <span
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
            activeCategory === 'ALL'
              ? 'bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {totalFiles}
        </span>
      </button>
    </div>
  );
};
