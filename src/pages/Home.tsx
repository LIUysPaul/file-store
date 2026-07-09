import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getFiles, uploadFile, deleteFile, fileToBase64, FileItem } from '@/utils/githubApi';
import { Navbar } from '@/components/Navbar';
import { UploadArea } from '@/components/UploadArea';
import { FileList } from '@/components/FileList';
import { FileText, RefreshCw } from 'lucide-react';

export const Home = () => {
  const { user, files, setFiles, addFile, removeFile, setLoading, isLoading } = useAuthStore();
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  const loadFiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fileList = await getFiles(user.token, user.repo, user.defaultBranch);
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  }, [user, setFiles, setLoading]);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    if (!user) return;
    setUploadError(null);

    for (const file of selectedFiles) {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('文件大小不能超过 50MB');
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const newFile = await uploadFile(user.token, user.repo, file.name, base64, user.defaultBranch);
        addFile(newFile);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : '上传失败');
      }
    }
  }, [user, addFile]);

  const handleDownload = useCallback((file: FileItem) => {
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleDelete = useCallback(async (filePath: string) => {
    if (!user) return;
    
    if (!confirm('确定要删除这个文件吗？')) return;
    
    const fileItem = files.find(f => f.path === filePath);
    if (!fileItem) return;
    
    try {
      await deleteFile(user.token, user.repo, filePath, fileItem.sha, user.defaultBranch);
      removeFile(filePath);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  }, [user, files, removeFile]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-500 p-2 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">我的文件</h1>
            </div>
            <p className="text-white/60">
              {files.length} 个文件 · 存储于 {user?.repo}
            </p>
          </div>
          
          <button
            onClick={loadFiles}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm">刷新</span>
          </button>
        </div>

        <div className="mb-8">
          <UploadArea onFilesSelected={handleFilesSelected} />
          {uploadError && (
            <div className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
              {uploadError}
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          {isLoading && files.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/50">加载中...</p>
            </div>
          ) : (
            <FileList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
};