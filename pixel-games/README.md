# Pixel Games — Vibe Coding Collection

三款纯原生 HTML5 Canvas 像素游戏，零依赖、零构建，开箱即部署到 GitHub Pages。

## 在线试玩

部署到 GitHub Pages 后，访问：

```
https://<你的用户名>.github.io/<仓库名>/
```

门户首页会展示三款游戏卡片，点击即可进入。

## 游戏列表

| # | 游戏 | 目录 | 类型 |
|---|------|------|------|
| 1 | MECHA BATTLE — 像素风机甲对战 | `mechabattle/` | 双人格斗 |
| 2 | DUNGEON PIXEL — 像素地牢探险 | `dungeon/` | Roguelike |
| 3 | STAR PIXEL — 像素太空射击 | `spaceshooter/` | 弹幕射击 |

---

## 部署到 GitHub Pages（3 步）

### 1. 创建仓库并推送代码

```bash
git init
git add .
git commit -m "Pixel Games - Vibe Coding Collection"
git branch -M main
git remote add origin https://github.com/<你的用户名>/pixel-games.git
git push -u origin main
```

### 2. 开启 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，文件夹选 `/ (root)`
4. 点击 **Save**

### 3. 等待部署完成

约 1-2 分钟后，在仓库首页右侧 **Environments** 区域可以看到部署状态。
部署成功后访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。

> `.nojekyll` 文件已包含在仓库根目录，确保 GitHub Pages 不会用 Jekyll 处理（避免 `_` 开头的文件被忽略）。

---

## 本地运行

```bash
# 任意静态服务器均可
python3 -m http.server 8080

# 或
npx serve .
```

浏览器打开 `http://localhost:8080/` 即可看到门户首页。

---

## 项目结构

```
.
├── index.html              # 门户首页（游戏入口）
├── .nojekyll               # 禁用 GitHub Pages Jekyll 处理
├── README.md               # 本文件
├── docs/                   # 设计文档（PRD + 技术架构）
│   ├── PRD-像素风机甲对战游戏.md
│   ├── TECH-像素风机甲对战游戏.md
│   ├── PRD-像素地牢探险.md
│   ├── TECH-像素地牢探险.md
│   ├── PRD-像素太空射击.md
│   └── TECH-像素太空射击.md
├── mechabattle/            # 游戏1：机甲对战
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── constants.js
│       ├── mecha.js
│       ├── scenes.js
│       └── main.js
├── dungeon/                # 游戏2：地牢探险
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── constants.js
│       ├── dungeonGenerator.js
│       ├── player.js
│       ├── enemy.js
│       ├── scenes.js
│       └── main.js
└── spaceshooter/           # 游戏3：太空射击
    ├── index.html
    ├── style.css
    └── js/
        ├── constants.js
        ├── managers.js
        ├── entities.js
        ├── scenes.js
        └── main.js
```

## 游戏操作

### MECHA BATTLE — 机甲对战
- **P1（蓝方）**：A/D 移动、W 跳跃、F 攻击、G 防御
- **P2（红方）**：←/→ 移动、↑ 跳跃、小键盘1 攻击、小键盘2 防御

### DUNGEON PIXEL — 地牢探险
- **WASD / 方向键** — 移动
- **空格** — 攻击

### STAR PIXEL — 太空射击
- **WASD / 方向键** — 移动
- **自动射击**（持续发射）
- **空格** — 炸弹清屏（限量）

## 技术栈

- HTML5 Canvas 2D + 原生 JavaScript（ES6+）
- 无框架、无构建工具、无外部图片资源
- 所有像素素材通过 Canvas API 程序绘制
- 字体：Google Fonts — Press Start 2P
- 完全静态文件，适配 GitHub Pages / Netlify / Vercel 等任意静态托管
