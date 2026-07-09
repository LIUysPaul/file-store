import { FileCard } from './FileCard';
import { FileItem } from '@/utils/githubApi';
import { FolderOpen } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onDelete: (filePath: string) => void;
}

export const FileList = ({ files, onDownload, onDelete }: FileListProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4">
          <FolderOpen className="w-10 h-10 text-white/40" />
        </div>
        <h3 className="text-white/60 text-lg font-medium">暂无文件</h3>
        <p className="text-white/40 text-sm mt-2">点击上方区域上传文件</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileCard
          key={file.path}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};