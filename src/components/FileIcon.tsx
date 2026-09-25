import React from 'react';
import { FileType } from '@/types/resources';
import { getFileTypeIcon } from '@/lib/icons';

interface FileIconProps {
  type: FileType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FileIcon: React.FC<FileIconProps> = ({ type, className = '', size = 'md' }) => {
  const meta = getFileTypeIcon(type);
  const IconComponent = meta.icon;

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 rounded-lg text-xs',
    md: 'w-10 h-10 p-2 rounded-xl text-sm',
    lg: 'w-12 h-12 p-2.5 rounded-2xl text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`inline-flex items-center justify-center border flex-shrink-0 font-medium ${meta.bgClass} ${meta.colorClass} ${sizeClasses[size]} ${className}`}
      title={meta.label}
    >
      <IconComponent size={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
};
