'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, getModuleBySlug } from '@/lib/data';
import { ResourceDocument } from '@/types/resources';
import { getModuleIcon } from '@/lib/icons';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileCard } from '@/components/FileCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchModal } from '@/components/SearchModal';
import { PdfViewerModal } from '@/components/PdfViewerModal';
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
  FolderOpen,
  ArrowLeft,
  FileCheck,
  Files,
  X,
  User,
  Clock,
  FolderPlus
} from 'lucide-react';

interface ModulePageProps {
  params: {
    slug: string;
  };
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

export default function ModulePage({ params }: ModulePageProps) {
  const module = getModuleBySlug(params.slug);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ResourceDocument | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('ALL');

  if (!module) {
    notFound();
  }

  const IconComponent = getModuleIcon(module.icon);

  // Filtered files inside this module
  const filteredFiles = useMemo(() => {
    return module.files.filter((file) => {
      // Category filter
      if (activeCategory !== 'ALL' && file.categoryKey !== activeCategory) {
        return false;
      }

      // File type filter
      if (fileTypeFilter !== 'ALL' && file.type !== fileTypeFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = file.name.toLowerCase().includes(q);
        const matchesCat = file.categoryDisplay.toLowerCase().includes(q);
        const matchesExt = file.extension.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesExt) {
          return false;
        }
      }

      return true;
    });
  }, [module.files, activeCategory, fileTypeFilter, searchQuery]);

  // Group files strictly in the requested category order when "ALL" is selected
  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'ALL' || searchQuery.trim() || fileTypeFilter !== 'ALL') {
      return null;
    }

    const groups: { key: string; name: string; files: ResourceDocument[] }[] = [];
    
    // Sort categories list according to CATEGORY_ORDER
    const sortedCats = [...module.categoriesList].sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a.key);
      const idxB = CATEGORY_ORDER.indexOf(b.key);
      const orderA = idxA === -1 ? 99 : idxA;
      const orderB = idxB === -1 ? 99 : idxB;
      return orderA - orderB;
    });

    sortedCats.forEach((cat) => {
      if (cat.files && cat.files.length > 0) {
        groups.push({
          key: cat.key,
          name: cat.name,
          files: cat.files,
        });
      }
    });

    return groups;
  }, [activeCategory, searchQuery, fileTypeFilter, module.categoriesList]);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} totalDocuments={catalog.metadata.totalDocuments} />

      <main className="flex-1">
        {/* Module Header / Hero */}
        <section className="relative overflow-hidden pt-8 pb-10 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                <span>Accueil</span>
              </Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                {module.name}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${module.bgLight} ${module.borderLight} border ${module.accent} shadow-sm flex-shrink-0`}>
                  <IconComponent size={28} strokeWidth={2.2} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {module.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    {module.professor && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/60 dark:border-blue-900/40">
                        <User size={13} />
                        {module.professor}
                      </span>
                    )}
                    {module.schedule && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        <Clock size={12} />
                        {module.schedule}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 max-w-2xl leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center">
                <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{module.totalFiles}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Documents</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{module.categoriesList.length}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Catégories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="sticky top-16 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            {/* Category tabs */}
            <CategoryFilter
              categories={module.categoriesList}
              activeCategory={activeCategory}
              onSelectCategory={(key) => setActiveCategory(key)}
              totalFiles={module.totalFiles}
            />

            {/* Sub-search bar & type filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Rechercher dans ${module.name}...`}
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">Format :</span>
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Tous les formats</option>
                  <option value="pdf">PDF uniquement</option>
                  <option value="word">Word (.docx, .doc)</option>
                  <option value="powerpoint">PowerPoint (.pptx)</option>
                  <option value="image">Images (.jpg, .png)</option>
                  <option value="archive">Archives (.zip, .rar)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Files Content Area */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {module.totalFiles === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-xl mx-auto">
              <FolderPlus size={48} className="mx-auto mb-4 text-blue-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Aucun document pour l&apos;instant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Le dossier pour <strong className="text-slate-700 dark:text-slate-300">{module.name}</strong> est déjà prêt dans :
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-blue-600 dark:text-blue-400 break-all">
                public/resources/{module.name}/
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Déposez vos cours et fichiers dans ce dossier puis lancez <code className="font-bold text-slate-700 dark:text-slate-300">npm run sync</code> pour les afficher ici.
              </p>
            </div>
          ) : groupedByCategory && groupedByCategory.length > 0 ? (
            <div className="space-y-10">
              {groupedByCategory.map((catData) => (
                <div key={catData.key} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{catData.name}</span>
                      <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {catData.files.length}
                      </span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catData.files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onPreview={(f) => setPreviewFile(f)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {filteredFiles.length} document{filteredFiles.length > 1 ? 's' : ''} trouvé{filteredFiles.length > 1 ? 's' : ''}
                </span>
                {(activeCategory !== 'ALL' || searchQuery || fileTypeFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setActiveCategory('ALL');
                      setSearchQuery('');
                      setFileTypeFilter('ALL');
                    }}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>

              {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={(f) => setPreviewFile(f)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <FolderOpen size={40} className="mx-auto mb-3 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Aucun document ne correspond à vos critères
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Essayez d&apos;ajuster vos filtres de catégorie, votre terme de recherche ou le format de fichier.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('ALL');
                      setSearchQuery('');
                      setFileTypeFilter('ALL');
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
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
