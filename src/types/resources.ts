export type FileType = 'pdf' | 'word' | 'powerpoint' | 'excel' | 'image' | 'archive' | 'text' | 'other';

export interface ResourceDocument {
  id: string;
  name: string;
  module: string;
  categoryKey: string;
  categoryDisplay: string;
  size: number;
  sizeFormatted: string;
  extension: string;
  type: FileType;
  url: string;
}

export interface ResourceCategory {
  key: string;
  name: string;
  count: number;
  files: ResourceDocument[];
}

export interface ModuleData {
  id: string;
  slug: string;
  name: string;
  professor?: string;
  schedule?: string;
  description: string;
  icon: string;
  color: string;
  accent: string;
  bgLight: string;
  borderLight: string;
  totalFiles: number;
  categories: Record<string, ResourceCategory>;
  categoriesList: ResourceCategory[];
  files: ResourceDocument[];
}

export interface ResourceCatalog {
  metadata: {
    title: string;
    semester: string;
    totalModules: number;
    totalDocuments: number;
    generatedAt: string;
  };
  modules: ModuleData[];
  allFiles: ResourceDocument[];
}
