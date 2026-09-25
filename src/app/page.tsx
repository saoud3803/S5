'use client';

import React, { useState } from 'react';
import { catalog, getCatalogStats } from '@/lib/data';
import { ResourceDocument } from '@/types/resources';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ModuleCard } from '@/components/ModuleCard';
import { SearchModal } from '@/components/SearchModal';
import { PdfViewerModal } from '@/components/PdfViewerModal';
import { Search, Sparkles, Calendar } from 'lucide-react';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ResourceDocument | null>(null);
  const [homeFilter, setHomeFilter] = useState('');

  const stats = getCatalogStats();

  const filteredModules = catalog.modules.filter((m) => {
    if (!homeFilter.trim()) return true;
    const q = homeFilter.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.professor && m.professor.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} totalDocuments={stats.totalFiles} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-10 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 dark:from-slate-900/60 dark:via-slate-900/20 dark:to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50 mb-4 shadow-sm">
                <Sparkles size={14} className="text-blue-500" />
                <span>Semestre S5 • Emploi du Temps Officiel</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                Bibliothèque de Ressources <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">S5</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Portail centralisé dédié aux <strong>7 modules officiels</strong> de votre semestre S5. Cours, TP, TD, examens, corrigés et projets en accès direct et instantané.
              </p>

              {/* Main Search Bar in Hero */}
              <div className="relative max-w-xl mx-auto">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="group flex items-center justify-between p-2 pl-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-lg shadow-blue-500/5 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 flex-1 min-w-0">
                    <Search size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                      Rechercher parmi {stats.totalFiles} documents (cours, TP, TD, examen, corrigé)...
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Rechercher</span>
                    <kbd className="font-mono text-[10px] text-slate-400 ml-1">⌘K</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid Section */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={22} className="text-blue-600 dark:text-blue-400" />
                Modules du Semestre S5 (Emploi du Temps)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Retrouvez vos 7 modules ordonnés selon votre planning hebdomadaire.
              </p>
            </div>

            {/* Quick module filter input */}
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={homeFilter}
                onChange={(e) => setHomeFilter(e.target.value)}
                placeholder="Filtrer les modules ou professeurs..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Aucun module ne correspond à &quot;{homeFilter}&quot;
              </p>
              <button
                onClick={() => setHomeFilter('')}
                className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Réinitialiser le filtre
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        modules={catalog.modules}
        allFiles={catalog.allFiles}
        onPreviewFile={(file) => setPreviewFile(file)}
      />

      {/* PDF / Document Viewer Modal */}
      <PdfViewerModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
