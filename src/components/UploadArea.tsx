import { useState, useCallback } from 'react';
import { Upload, Plus } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export const UploadArea = ({ onFilesSelected }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  }, [onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
        isDragging
          ? 'border-primary-400 bg-primary-500/20'
          : isHovering
          ? 'border-white/40 bg-white/10'
          : 'border-white/20 bg-white/5 hover:border-white/30'
      }`}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDragging ? 'bg-primary-500 scale-110' : 'bg-white/10'
        }`}>
          {isDragging ? (
            <Plus className="w-8 h-8 text-white" />
          ) : (
            <Upload className="w-8 h-8 text-white/60" />
          )}
        </div>
        
        <div>
          <h3 className={`text-lg font-medium transition-colors duration-300 ${
            isDragging ? 'text-primary-300' : 'text-white/80'
          }`}>
            {isDragging ? '释放以上传文件' : '拖拽文件到此处'}
          </h3>
          <p className="text-white/40 text-sm mt-1">
            或点击选择文件
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <span>支持所有文件类型</span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span>单个文件最大 50MB</span>
        </div>
      </div>
    </div>
  );
};