#!/usr/bin/env bash
# 本地一键部署：构建 -> 打包 -> 上传 -> 解包 -> reload nginx
# 用法（在项目根目录，Git Bash 中执行）：
#   bash deploy/deploy.sh
# 覆盖默认值：
#   SERVER_IP=47.93.0.203 SERVER_USER=root bash deploy/deploy.sh
#
# 前提：本地已能免密或输密码 ssh 登录服务器；服务器已装好 nginx 且站点目录为 $TARGET_DIR

set -euo pipefail

SERVER_IP="${SERVER_IP:-47.93.0.203}"
SERVER_USER="${SERVER_USER:-root}"
TARGET_DIR="${TARGET_DIR:-/var/www/portfolio}"
ARCHIVE="/tmp/portfolio-build-$$.tar.gz"
LOCAL_ARCHIVE="./portfolio-build.tar.gz"

# 安全护栏：只允许操作以 portfolio 结尾的目录，避免手滑删错
case "$TARGET_DIR" in
  */portfolio) ;;
  *) echo "TARGET_DIR 必须以 /portfolio 结尾，当前为：$TARGET_DIR" >&2; exit 1 ;;
esac

echo "==> 1/5 构建（npm run build）"
npm run build

echo "==> 2/5 打包构建产物"
rm -f "$LOCAL_ARCHIVE"
tar -czf "$LOCAL_ARCHIVE" -C build .

echo "==> 3/5 上传到服务器 $SERVER_IP"
scp "$LOCAL_ARCHIVE" "$SERVER_USER@$SERVER_IP:$ARCHIVE"

echo "==> 4/5 服务器端解包并授权"
ssh "$SERVER_USER@$SERVER_IP" "
  set -e
  mkdir -p '$TARGET_DIR'
  find '$TARGET_DIR' -mindepth 1 -delete
  tar -xzf '$ARCHIVE' -C '$TARGET_DIR'
  chown -R www-data:www-data '$TARGET_DIR'
  chmod -R 755 '$TARGET_DIR'
  rm -f '$ARCHIVE'
"

echo "==> 5/5 校验并 reload nginx"
ssh "$SERVER_USER@$SERVER_IP" "nginx -t && systemctl reload nginx"

rm -f "$LOCAL_ARCHIVE"
echo ""
echo "部署完成 -> http://$SERVER_IP"
