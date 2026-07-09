import { Download, Trash2, File, FileText, Image, FileArchive, FileCode } from 'lucide-react';
import { FileItem } from '@/utils/githubApi';

interface FileCardProps {
  file: FileItem;
  onDownload: (file: FileItem) => void;
  onDelete: (filePath: string) => void;
}

const getFileIcon = (type: string) => {
  if (type === 'image') return <Image className="w-8 h-8 text-primary-400" />;
  if (type === 'pdf') return <FileText className="w-8 h-8 text-red-400" />;
  if (type === 'archive') return <FileArchive className="w-8 h-8 text-yellow-400" />;
  if (type === 'code') return <FileCode className="w-8 h-8 text-green-400" />;
  return <File className="w-8 h-8 text-blue-400" />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const FileCard = ({ file, onDownload, onDelete }: FileCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10 group">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-white/5 p-3 rounded-xl">
          {getFileIcon(file.type)}
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="text-white font-medium truncate">{file.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-white/50 text-sm">{formatSize(file.size)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onDownload(file)}
            className="p-2 bg-primary-500/20 hover:bg-primary-500/40 text-primary-400 rounded-lg transition-all duration-300 hover:scale-110"
            title="下载"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(file.path)}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-all duration-300 hover:scale-110"
            title="删除"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};