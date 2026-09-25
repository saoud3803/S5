'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ResourceDocument, ModuleData } from '@/types/resources';
import { FileIcon } from './FileIcon';
import { Search, X, BookOpen, ExternalLink, Download, ArrowRight, CornerDownLeft } from 'lucide-react';
import { getModuleIcon } from '@/lib/icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: ModuleData[];
  allFiles: ResourceDocument[];
  onPreviewFile: (file: ResourceDocument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  modules,
  allFiles,
  onPreviewFile,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('ALL');
    }
  }, [isOpen]);

  // Handle global Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const filteredModules = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.professor && m.professor.toLowerCase().includes(q))
    );
  }, [modules, query]);

  const filteredFiles = useMemo(() => {
    if (!query.trim() && selectedCategory === 'ALL') return [];
    const q = query.toLowerCase().trim();

    return allFiles.filter((file) => {
      const matchCat = selectedCategory === 'ALL' || file.categoryKey === selectedCategory;
      if (!matchCat) return false;

      if (!q) return true;

      return (
        file.name.toLowerCase().includes(q) ||
        file.module.toLowerCase().includes(q) ||
        file.categoryDisplay.toLowerCase().includes(q) ||
        file.extension.toLowerCase().includes(q)
      );
    }).slice(0, 50);
  }, [allFiles, query, selectedCategory]);

  const totalResults = filteredModules.length + filteredFiles.length;

  const handleSelectModule = (slug: string) => {
    onClose();
    router.push(`/module/${slug}`);
  };

  const handleSelectFile = (file: ResourceDocument) => {
    onClose();
    onPreviewFile(file);
  };

  if (!isOpen) return null;

  // Categories in strict requested order, with "Tout" at the end
  const categories = [
    { key: 'Cours', label: '📚 Cours' },
    { key: 'TP', label: '💻 TP' },
    { key: 'TD', label: '📝 Exercices / TD' },
    { key: 'Projets', label: '🎯 Projets & Exposés' },
    { key: 'Examens', label: '📄 Examens' },
    { key: 'Corriges', label: '✅ Corrigés' },
    { key: 'Autres', label: '📁 Autres documents' },
    { key: 'ALL', label: 'Tous les documents' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Search size={20} className="text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un module, cours, TP, TD, examen, corrigé, mot-clé..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 ml-2 rounded text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800">
            ESC
          </span>
        </div>

        {/* Quick category filter tags in exact order */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Filtre :</span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!query.trim() && selectedCategory === 'ALL' && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Search size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-medium text-slate-600 dark:text-slate-400">Recherchez parmi {allFiles.length} documents et {modules.length} modules</p>
              <p className="text-[11px] mt-1 text-slate-400">Exemples : <span className="font-semibold">Ponts</span>, <span className="font-semibold">Dynamique</span>, <span className="font-semibold">Marchés</span>, <span className="font-semibold">Charpente</span></p>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              <p className="font-medium">Aucun résultat trouvé pour &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Essayez avec d&apos;autres mots-clés ou modifiez les filtres de catégorie.</p>
            </div>
          )}

          {/* Module matches */}
          {filteredModules.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Modules ({filteredModules.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredModules.map((m) => {
                  const Icon = getModuleIcon(m.icon);
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectModule(m.slug)}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${m.bgLight} ${m.accent}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {m.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {m.professor ? `${m.professor} • ` : ''}{m.totalFiles} documents
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Document matches */}
          {filteredFiles.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Documents ({filteredFiles.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Cliquez pour prévisualiser</span>
              </div>
              <div className="space-y-1.5 mt-1">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className="group flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <FileIcon type={file.type} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{file.module}</span>
                          <span>•</span>
                          <span>{file.categoryDisplay}</span>
                          <span>•</span>
                          <span className="font-mono">{file.sizeFormatted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={file.url}
                        download={file.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Télécharger"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">↵</kbd> Ouvrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">ESC</kbd> Fermer
            </span>
          </div>
          <div>
            Total indexé : <span className="font-semibold text-slate-700 dark:text-slate-300">{allFiles.length} fichiers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
