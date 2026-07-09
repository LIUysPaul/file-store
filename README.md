# FileStore - 个人文件云存储

一个基于 GitHub Pages + GitHub API 的个人文件存储工具，支持跨设备访问。

## 功能特性

- 🔐 使用 GitHub Token 登录，安全可靠
- ☁️ 文件存储在自己的 GitHub 仓库，数据归自己所有
- 📱 跨设备访问，电脑 A 上传电脑 B 下载
- 🚀 快速登录、一键登出
- 📤 拖拽上传，支持所有文件类型
- 🎨 简洁美观的深色界面

## 使用方法

### 1. 创建 GitHub Token

1. 访问 [GitHub Token 设置](https://github.com/settings/tokens?type=beta)
2. 点击 **Generate new token**
3. Repository access 选择 **Only select repositories**，选择你的文件仓库
4. Permissions → Repository permissions → **Contents** 选择 **Read and write**
5. 点击 Generate token，复制保存

### 2. 登录使用

1. 打开网站
2. 输入 GitHub Token
3. 输入仓库名（格式：`用户名/仓库名`）
4. 点击登录，开始使用

### 3. 跨设备同步

- 在任意设备上用同一个 Token + 仓库名登录
- 所有文件实时同步

## 技术栈

- React 19 + TypeScript
- Vite
- TailwindCSS
- Zustand
- Lucide React
- GitHub API

## 本地开发

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build
```

将 `dist/` 目录推送到 GitHub 仓库，开启 Pages 即可。

## 许可证

MIT