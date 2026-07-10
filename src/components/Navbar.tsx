import { LogOut, FileText, Github, Gamepad2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FileStore</span>
            </div>
            <Link
              to="/games"
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-sm">小游戏</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="w-8 h-8 rounded-full border-2 border-white/20"
              />
              <div className="hidden sm:block">
                <div className="text-white text-sm font-medium">{user.name || user.login}</div>
                <div className="text-white/50 text-xs flex items-center gap-1">
                  <Github className="w-3 h-3" />
                  {user.repo}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">登出</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};