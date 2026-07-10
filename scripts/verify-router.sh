#!/bin/bash
# 检查 App.tsx 是否使用 HashRouter（GitHub Pages 必须）
# 如果被改成 BrowserRouter 则自动修复并退出错误

set -e

APP_FILE="src/App.tsx"

if [ ! -f "$APP_FILE" ]; then
  echo "❌ 错误：找不到 $APP_FILE"
  exit 1
fi

if grep -q "BrowserRouter" "$APP_FILE"; then
  echo "⚠️  检测到 BrowserRouter，正在自动修复为 HashRouter..."
  sed -i.bak 's/BrowserRouter/HashRouter/g' "$APP_FILE"
  rm -f "$APP_FILE.bak"
  echo "✅ 已修复 $APP_FILE（BrowserRouter → HashRouter）"
  echo "   请重新运行此命令以继续。"
  exit 2
fi

if grep -q "HashRouter" "$APP_FILE"; then
  echo "✅ App.tsx 使用 HashRouter，符合 GitHub Pages 要求"
  exit 0
else
  echo "❌ 错误：$APP_FILE 中找不到 HashRouter 或 BrowserRouter"
  echo "   请手动检查路由配置"
  exit 1
fi
