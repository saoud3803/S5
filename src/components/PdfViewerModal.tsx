'use client';

import React, { useEffect } from 'react';
import { ResourceDocument } from '@/types/resources';
import { X, Download, ExternalLink, FileText, Maximize2 } from 'lucide-react';

interface PdfViewerModalProps {
  file: ResourceDocument | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ file, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!file) return null;

  const isPdf = file.type === 'pdf';
  const isImage = file.type === 'image';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-md sm:max-w-xl" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{file.module}</span>
                <span>•</span>
                <span>{file.categoryDisplay}</span>
                <span>•</span>
                <span>{file.sizeFormatted}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Ouvrir en plein écran dans un nouvel onglet"
            >
              <Maximize2 size={18} />
            </a>

            <a
              href={file.url.startsWith('http') ? `${file.url}${file.url.includes('?') ? '&' : '?'}download=` : file.url}
              download={file.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              title="Télécharger le document"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Télécharger</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Fermer (Échap)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={`${file.url}#view=FitH`}
              className="w-full h-full border-none"
              title={file.name}
            />
          ) : isImage ? (
            <div className="p-4 flex items-center justify-center max-h-full max-w-full overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt={file.name}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow"
              />
            </div>
          ) : (
            <div className="text-center p-8 max-w-md">
              <FileText size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                La prévisualisation intégrée directe n&apos;est pas disponible pour les fichiers <span className="font-mono font-bold">.{file.extension}</span>.
              </p>
              <a
                href={file.url}
                download={file.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Télécharger le fichier
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
