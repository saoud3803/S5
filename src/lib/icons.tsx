import React from 'react';
import {
  Droplets,
  Grid,
  Activity,
  Layers,
  Milestone,
  HardHat,
  Compass,
  Building2,
  FolderArchive,
  Folder,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileCode,
  File,
  LucideIcon
} from 'lucide-react';
import { FileType } from '@/types/resources';

export function getModuleIcon(iconName: string): LucideIcon {
  switch (iconName) {
    case 'Droplets':
      return Droplets;
    case 'Grid':
      return Grid;
    case 'Activity':
      return Activity;
    case 'Layers':
      return Layers;
    case 'Milestone':
      return Milestone;
    case 'HardHat':
      return HardHat;
    case 'Compass':
      return Compass;
    case 'Building2':
      return Building2;
    case 'FolderArchive':
      return FolderArchive;
    default:
      return Folder;
  }
}

export function getFileTypeIcon(type: FileType): { icon: LucideIcon; colorClass: string; bgClass: string; label: string } {
  switch (type) {
    case 'pdf':
      return {
        icon: FileText,
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60',
        label: 'PDF'
      };
    case 'word':
      return {
        icon: FileText,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60',
        label: 'Word'
      };
    case 'powerpoint':
      return {
        icon: FileText,
        colorClass: 'text-orange-600 dark:text-orange-400',
        bgClass: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-900/60',
        label: 'PPT'
      };
    case 'excel':
      return {
        icon: FileSpreadsheet,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60',
        label: 'Excel'
      };
    case 'image':
      return {
        icon: FileImage,
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900/60',
        label: 'Image'
      };
    case 'archive':
      return {
        icon: FileArchive,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60',
        label: 'Archive'
      };
    case 'text':
      return {
        icon: FileCode,
        colorClass: 'text-teal-600 dark:text-teal-400',
        bgClass: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-900/60',
        label: 'Texte'
      };
    default:
      return {
        icon: File,
        colorClass: 'text-slate-600 dark:text-slate-400',
        bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        label: 'Fichier'
      };
  }
}
