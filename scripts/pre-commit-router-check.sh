#!/bin/bash
# Git pre-commit hook: 阻止把 HashRouter 改成 BrowserRouter 提交
# 安装方法: cp scripts/pre-commit-router-check.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

APP_FILE="src/App.tsx"

if [ ! -f "$APP_FILE" ]; then
  exit 0
fi

# 只在 App.tsx 被暂存时检查
if git diff --cached --name-only | grep -q "^${APP_FILE}$"; then
  if grep -q "BrowserRouter" "$APP_FILE"; then
    echo ""
    echo "❌ 提交被阻止：App.tsx 使用了 BrowserRouter"
    echo "   GitHub Pages 子路径下 BrowserRouter 会导致页面空白/404"
    echo "   请改用 HashRouter："
    echo "     import { HashRouter as Router } from 'react-router-dom';"
    echo ""
    echo "   如需绕过检查（不推荐），使用 git commit --no-verify"
    echo ""
    exit 1
  fi
fi

exit 0
