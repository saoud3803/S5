import React from 'react';
import { BookOpen, Sparkles, FolderSync } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 py-8 mt-16 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-600 dark:text-blue-400" />
          <span>Plateforme de Ressources Universitaires — Semestre S5</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Organisé automatiquement par module & catégorie</span>
          <span>•</span>
          <span className="font-mono text-[11px]">386 Documents</span>
        </div>
      </div>
    </footer>
  );
};
