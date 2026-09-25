import rawCatalog from '@/data/resources.json';
import { ResourceCatalog, ModuleData, ResourceDocument } from '@/types/resources';

export const catalog: ResourceCatalog = rawCatalog as unknown as ResourceCatalog;

export function getAllModules(): ModuleData[] {
  return catalog.modules;
}

export function getModuleBySlug(slug: string): ModuleData | undefined {
  return catalog.modules.find(m => m.slug === slug || m.id === slug);
}

export function getAllFiles(): ResourceDocument[] {
  return catalog.allFiles;
}

export function getCatalogStats() {
  const totalFiles = catalog.metadata.totalDocuments;
  const totalModules = catalog.metadata.totalModules;
  
  // Count by file type
  const typeCounts: Record<string, number> = {};
  catalog.allFiles.forEach(f => {
    typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
  });

  // Count by category
  const categoryCounts: Record<string, number> = {};
  catalog.allFiles.forEach(f => {
    categoryCounts[f.categoryDisplay] = (categoryCounts[f.categoryDisplay] || 0) + 1;
  });

  return {
    totalFiles,
    totalModules,
    typeCounts,
    categoryCounts,
  };
}
