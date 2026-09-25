'use client';

import React from 'react';
import { ResourceDocument } from '@/types/resources';
import { FileIcon } from './FileIcon';
import { Download, ExternalLink, Eye } from 'lucide-react';

interface FileCardProps {
  file: ResourceDocument;
  onPreview?: (file: ResourceDocument) => void;
  showModuleBadge?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPreview, showModuleBadge = false }) => {
  const isPdf = file.type === 'pdf';
  const isImage = file.type === 'image';
  const canPreview = isPdf || isImage;

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPreview) {
      onPreview(file);
    } else {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5">
          <FileIcon type={file.type} size="md" />
          
          <div className="flex-1 min-w-0">
            <h4 
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug break-words" 
              title={file.name}
            >
              {file.name}
            </h4>

            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {file.categoryDisplay}
              </span>

              {showModuleBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40 truncate max-w-[150px]">
                  {file.module}
                </span>
              )}

              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                {file.sizeFormatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50">
          .{file.extension}
        </span>

        <div className="flex items-center gap-1.5">
          {canPreview ? (
            <button
              onClick={handlePreviewClick}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors"
              title="Aperçu rapide"
            >
              <Eye size={13} />
              <span>Aperçu</span>
            </button>
          ) : (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink size={13} />
              <span>Ouvrir</span>
            </a>
          )}

          <a
            href={file.url}
            download={file.name}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-100 transition-colors shadow-sm"
            title="Télécharger le fichier"
          >
            <Download size={13} />
            <span>Télécharger</span>
          </a>
        </div>
      </div>
    </div>
  );
};
