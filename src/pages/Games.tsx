import { useNavigate } from "react-router-dom";
import { Gamepad2, Sword, Zap, Rocket, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const games = [
  {
    id: "mechabattle",
    title: "MECHA BATTLE",
    subtitle: "PIXEL MECHA FIGHTER",
    description: "双人同屏格斗争霸。操控像素机甲进行移动、攻击、防御、跳跃，击败对手。",
    icon: Sword,
    tags: ["2P Versus", "Fighting"],
    color: "#00ffff",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "dungeon",
    title: "DUNGEON PIXEL",
    subtitle: "ROGUELIKE DUNGEON",
    description: "俯视角地牢探险。随机生成地图，击败怪物、收集道具、挑战关底BOSS。",
    icon: Zap,
    tags: ["Roguelike", "Adventure"],
    color: "#ff4444",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  {
    id: "spaceshooter",
    title: "STAR PIXEL",
    subtitle: "SPACE BULLET SHOOTER",
    description: "纵向卷轴弹幕射击。自动射击、炸弹清屏、5级武器升级、多阶段BOSS战。",
    icon: Rocket,
    tags: ["Shoot 'em up", "Bullet Hell"],
    color: "#ff00aa",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
  },
];

export function Games() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoBack = () => {
    navigate(user ? "/" : "/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回{user ? "主页" : "登录"}</span>
          </button>
          <div className="text-white font-bold">FileStore</div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-purple-500/20 mb-4">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">PIXEL GAMES</h1>
            <p className="text-slate-400">3 games, pure HTML5 Canvas, zero dependencies</p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className={`group cursor-pointer rounded-xl p-6 ${game.bgColor} border ${game.borderColor} hover:border-opacity-60 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  borderTop: `3px solid ${game.color}`,
                  boxShadow: `0 0 20px ${game.color}15`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${game.color}22` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: game.color }} />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">#{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: game.color }}
                >
                  {game.title}
                </h2>
                <p className="text-xs text-slate-500 mb-3">{game.subtitle}</p>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${game.color}22`,
                    color: game.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${game.color}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${game.color}22`;
                  }}
                >
                  PLAY ▶
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5">
            <span className="text-xs text-slate-500">TECH STACK</span>
            <span className="text-xs text-slate-400 px-2 py-1 rounded border border-slate-700">HTML5 Canvas</span>
            <span className="text-xs text-slate-400 px-2 py-1 rounded border border-slate-700">Vanilla JS</span>
            <span className="text-xs text-slate-400 px-2 py-1 rounded border border-slate-700">No Framework</span>
          </div>
        </div>
      </div>
    </div>
  );
}
