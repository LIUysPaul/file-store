import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const gameInfo = {
  mechabattle: { title: "MECHA BATTLE", subtitle: "PIXEL MECHA FIGHTER" },
  dungeon: { title: "DUNGEON PIXEL", subtitle: "ROGUELIKE DUNGEON" },
  spaceshooter: { title: "STAR PIXEL", subtitle: "SPACE BULLET SHOOTER" },
};

export function GameEmbed() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = gameInfo[id as keyof typeof gameInfo];

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">游戏不存在</p>
          <button
            onClick={() => navigate("/games")}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            返回游戏列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回上一页</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">{game.title}</h1>
            <p className="text-xs text-slate-500">{game.subtitle}</p>
          </div>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="pt-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <iframe
            src={`/file-store/games/${id}/index.html`}
            title={game.title}
            className="w-full max-w-4xl rounded-lg border-2 border-slate-700 shadow-2xl"
            style={{ height: "600px", minHeight: "500px" }}
            frameBorder={0}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
