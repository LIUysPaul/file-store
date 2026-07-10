import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { verifyToken, getRepoInfo, verifyRepoWriteAccess } from '@/utils/githubApi';
import { FileText, Key, Github, Eye, EyeOff, ArrowRight, HelpCircle, ExternalLink, CheckCircle, XCircle, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error } = useAuthStore();
  
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [step, setStep] = useState<'idle' | 'verifying' | 'checking-repo' | 'checking-write' | 'success'>('idle');

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !repo) {
      setError('请填写 Token 和仓库名');
      return;
    }

    if (!repo.includes('/')) {
      setError('仓库名格式错误，请使用 owner/repo 格式');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setStep('verifying');
      const userData = await verifyToken(token);
      
      setStep('checking-repo');
      const repoInfo = await getRepoInfo(token, repo);
      
      setStep('checking-write');
      await verifyRepoWriteAccess(token, repo, repoInfo.default_branch);
      
      setStep('success');
      
      setTimeout(() => {
        login(userData, token, repo, repoInfo.default_branch);
        navigate('/');
      }, 500);
    } catch (err) {
      setStep('idle');
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [token, repo, login, navigate, setLoading, setError]);

  const steps = [
    { key: 'verifying', label: '验证 Token' },
    { key: 'checking-repo', label: '检查仓库' },
    { key: 'checking-write', label: '验证写入权限' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-primary-500/10">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary-500 p-3 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              登录 FileStore
            </h1>
            <p className="text-white/60">
              使用 GitHub Token 快速登录
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                <Key className="w-4 h-4" />
                GitHub Personal Access Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all duration-300 font-mono text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                <Github className="w-4 h-4" />
                仓库名 (owner/repo)
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="your-username/file-store"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all duration-300"
                required
              />
              <p className="text-white/40 text-xs mt-1">
                文件将存储在该仓库的 files/ 目录下
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {isLoading && step !== 'idle' && step !== 'success' && (
              <div className="space-y-2">
                {steps.map((s, index) => {
                  const isActive = step === s.key;
                  const isDone = steps.findIndex(st => st.key === step) > index;
                  
                  return (
                    <div
                      key={s.key}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-500/20 border border-primary-500/40'
                          : isDone
                          ? 'bg-green-500/10 border border-green-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : isActive ? (
                        <div className="w-5 h-5 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                      )}
                      <span className={`text-sm ${
                        isActive ? 'text-primary-300' : isDone ? 'text-green-300' : 'text-white/50'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {step === 'success' && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-500/20 border border-green-500/40 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm">验证成功，正在进入...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  登录
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              如何获取 GitHub Token？
            </button>
            
            {showHelp && (
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <p className="text-white/70 text-sm font-medium">创建 Fine-grained Token 步骤：</p>
                <p className="text-white/70 text-sm">
                  1. 访问 GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
                </p>
                <p className="text-white/70 text-sm">
                  2. 点击 "Generate new token"
                </p>
                <p className="text-white/70 text-sm">
                  3. 设置 Token 名称和有效期
                </p>
                <p className="text-white/70 text-sm">
                  4. <span className="text-primary-400">Repository access</span> 选择 "Only select repositories"，选择你的文件仓库
                </p>
                <p className="text-white/70 text-sm">
                  5. <span className="text-primary-400">Permissions → Repository permissions → Contents</span> 选择 "Read and write"
                </p>
                <p className="text-white/70 text-sm">
                  6. 点击 "Generate token"，复制生成的 Token
                </p>
                <a
                  href="https://github.com/settings/tokens?type=beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  前往 GitHub 创建 Token
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/60 hover:text-white/80 text-sm transition-all duration-300"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 游玩小游戏（无需登录）</span>
          </Link>
        </div>
      </div>
    </div>
  );
};