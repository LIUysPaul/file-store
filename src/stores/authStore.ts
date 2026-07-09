import { create } from 'zustand';
import { FileItem, GitHubUser } from '@/utils/githubApi';

interface User {
  login: string;
  name: string | null;
  avatarUrl: string;
  token: string;
  repo: string;
  defaultBranch: string;
}

interface AuthStore {
  user: User | null;
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  login: (userData: GitHubUser, token: string, repo: string, defaultBranch: string) => void;
  logout: () => void;
  setFiles: (files: FileItem[]) => void;
  addFile: (file: FileItem) => void;
  removeFile: (filePath: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const STORAGE_KEY = 'file_store_auth';

const loadFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: loadFromStorage(),
  files: [],
  isLoading: false,
  error: null,
  
  login: (userData, token, repo, defaultBranch) => {
    const user = {
      login: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      token,
      repo,
      defaultBranch
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, error: null });
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, files: [], error: null });
  },
  
  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({
    files: [file, ...state.files]
  })),
  
  removeFile: (filePath) => set((state) => ({
    files: state.files.filter(f => f.path !== filePath)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error })
}));