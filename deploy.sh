#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件 , yarn docs:build
npm run docs:build
# 进入生成的文件
cd docs/.vuepress/dist

# git初始化，每次初始化不影响推送
git init
git add -A
git commit -m 'deploy'
git branch -M main

# 如果你想要部署到 https://USERNAME.github.io
git push -f git@github.com:gypchip/gypchip.github.io.git main