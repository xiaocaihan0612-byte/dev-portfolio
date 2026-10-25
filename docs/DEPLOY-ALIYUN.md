# 部署到阿里云轻量应用服务器（Ubuntu 24.04）

> 服务器信息：`47.93.0.203`（公网） / Ubuntu 24.04 / 2 vCPU 1 GiB / 30 GiB ESSD
> 站点类型：Vite + React 纯静态站，构建产物约 2.8 MB，**不需要 Node 常驻、不需要数据库**

## 为什么不在服务器上构建

1 GiB 内存跑 `npm install`（上万文件）+ `vite build` 很容易被 OOM Killer 杀掉。
因此采用 **本地构建 → 上传产物 → Nginx 托管** 的路线：既快又稳，服务器上只装一个 Nginx。

---

## 第 0 步：确认控制台放行 80 端口

阿里云控制台 → 轻量应用服务器 → `Ubuntu-gjjx` → **防火墙** → 确认有 `HTTP 80` 规则。
没有就点「添加规则」，应用类型选 `HTTP`，端口 `80`，来源 `0.0.0.0/0`。

> 已验证：当前 80 端口返回 `Connection refused`（说明网络可达、只是没服务），通常意味着安全组已放行。若你之后访问变成超时，再回来检查这里。

顺便在实例详情页点「**重置密码**」，记下 root 密码（后面 SSH 登录要用）。

---

## 第 1 步：登录服务器

**本实例的登录用户是 `admin`（不是 root）**，提示符形如 `admin@...:~$`，所有需要管理员权限的命令前面要加 `sudo`。

两种方式任选：

**方式 A（图形化，已可用）**：控制台点「远程连接」→ Workbench 网页终端，浏览器里直接进入 `admin` 会话，无需密码。

**方式 B（本地终端，上传文件必须用这个）**：在项目目录打开 Git Bash：

```bash
ssh admin@47.93.0.203
# 首次会提示 The authenticity of host ... are you sure? 输入 yes 回车
# 然后输入 admin 的密码（输入时屏幕不显示，是正常现象）
```

> 如果不知道 admin 的密码：控制台 →「重置密码」可以重置。若重置的是 root 密码而 admin 仍无法登录，
> 在网页终端里执行 `sudo passwd admin` 直接给 admin 设一个密码，之后就能用方式 B 登录了。

---

## 第 2 步：服务器初始化（约 1~2 分钟）

逐段复制执行：

```bash
# 更新软件源（登录用户是 admin，需加 sudo）
sudo apt update

# 安装 Nginx（Ubuntu 24.04 自带 1.24）
sudo apt install -y nginx

# 创建站点目录，并把属主交给 admin，方便后续上传
sudo mkdir -p /var/www/portfolio
sudo chown -R admin:admin /var/www/portfolio

# 确认 nginx 已启动
sudo systemctl enable --now nginx
systemctl status nginx --no-pager
```

看到 `active (running)` 就说明 Web 服务起来了。此时浏览器打开 `http://47.93.0.203`，应该能看到 Nginx 的默认欢迎页（说明网络链路已通）。

---

## 第 3 步：本地构建并上传产物

**回到你 Windows 本地，在项目根目录打开 Git Bash**（不要关掉服务器的终端）。

我已经写好一键脚本，直接跑：

```bash
cd /d/Mycode/dev-portfolio-master
bash deploy/deploy.sh
```

脚本会依次做：构建 → 打包 → `scp` 上传 → 服务器解包 → `nginx -t` 校验 → reload。
中途会让你输入 **admin 的密码**；若 sudo 也需要密码，还会再问一次。

<details>
<summary>如果你想手动一步步来（或脚本报错时兜底）</summary>

```bash
# 1) 构建
cd /d/Mycode/dev-portfolio-master
npm run build

# 2) 打包（只打包 build 目录里的内容）
tar -czf portfolio-build.tar.gz -C build .

# 3) 上传（会把文件放到服务器 /tmp）
scp portfolio-build.tar.gz admin@47.93.0.203:/tmp/

# 4) 回到服务器终端，解包（注意 sudo）
sudo mkdir -p /var/www/portfolio
sudo tar -xzf /tmp/portfolio-build.tar.gz -C /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
rm -f /tmp/portfolio-build.tar.gz
```
</details>

<details>
<summary>如果本地 ssh/scp 连不上服务器（备选：用网页终端传文件）</summary>

1. 本地先执行 `npm run build` 和 `tar -czf portfolio-build.tar.gz -C build .`
2. 网页终端左上角「菜单」→ **文件** → 上传文件，把 `portfolio-build.tar.gz` 传到服务器的 `~` 目录
3. 网页终端里执行：

```bash
sudo mkdir -p /var/www/portfolio
sudo tar -xzf ~/portfolio-build.tar.gz -C /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
rm -f ~/portfolio-build.tar.gz
```
</details>

---

## 第 4 步：配置 Nginx 站点

**在服务器终端**执行：

```bash
# 写入站点配置（内容就是项目里的 deploy/nginx-portfolio.conf，用 tee 因为要 sudo）
sudo tee /etc/nginx/sites-available/portfolio > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 47.93.0.203;

    root /var/www/portfolio;
    index index.html;
    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff font/woff2;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location /profile/ {
        add_header Cache-Control "no-cache";
    }
}
EOF

# 启用站点，并禁用默认站点（否则默认页会抢占根路径）
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/default

# 校验配置并重载
sudo nginx -t
sudo systemctl reload nginx
```

关键点：`try_files $uri $uri/ /index.html` 是给 **BrowserRouter** 用的——你的站用了前端路由（`/edit` 等），没有这行，直接访问或刷新 `/edit` 会 404。

---

## 第 5 步：验证

浏览器打开 **http://47.93.0.203**，检查：

1. 首页能正常加载、图片和「光与蝶」背景都在
2. 右上角日夜切换正常
3. 直接访问 `http://47.93.0.203/edit` 不 404（能进编辑页）
4. 手机流量访问一次，确认外网可访问

命令行自查：

```bash
curl -I http://127.0.0.1          # 期望 HTTP/1.1 200 OK
curl -s http://127.0.0.1 | head   # 期望看到你的 index.html
```

---

## 第 6 步：把代码推到 GitHub（之前失败的原因）

之前推不上去，是因为 **GitHub 不再接受账号密码，HTTPS 推送需要 Personal Access Token**，而本机凭据里没有。
（你的本地仓库其实已经提交好了 4 个 commit，只差这一步推送。）

在项目根目录 Git Bash 执行：

```bash
cd /d/Mycode/dev-portfolio-master
git push -u origin main
```

- 如果弹出 Git Credential Manager 窗口 → 选 `Sign in with your browser`，浏览器里登录 GitHub 授权，会自动完成推送。
- 如果提示 `could not read Username` 或密码错误 →
  1. 打开 https://github.com/settings/tokens → `Generate new token (classic)`
  2. Note 随便填（如 `portfolio-deploy`），Expiration 选 90 days，勾选 **`repo`** 权限
  3. 生成后复制那串 `ghp_...`（只显示一次）
  4. 再执行 `git push -u origin main`，用户名填 `xiaocaihan0612-byte`，**密码处粘贴 token**

推送成功后终端会显示 `main -> main`。

> 可选优化：`.gitignore` 里把 `package-lock.json` 也忽略了，建议删掉这一行并提交，锁文件入库能保证依赖版本可复现：
> ```bash
> # 编辑 .gitignore 删掉 package-lock.json 那一行
> git add .gitignore package-lock.json
> git commit -m "chore: 提交 package-lock.json 锁定依赖版本"
> git push
> ```

---

## 日常更新流程（以后改了内容）

改完代码后，只要两行：

```bash
cd /d/Mycode/dev-portfolio-master
bash deploy/deploy.sh      # 重新构建并覆盖线上
git add -A && git commit -m "update: xxx" && git push   # 同步到 GitHub
```

**注意**：`/edit` 页面里的可视化编辑保存的是**浏览器 localStorage**，只对当前浏览器生效，不会写到服务器。
想让内容对所有访客生效，要改 `public/profile/*.json` 后重新部署。

---

## 常见问题排查

| 现象 | 原因 / 处理 |
|---|---|
| 访问 IP 打不开、一直转圈 | 安全组没放行 80，回第 0 步 |
| 显示 Nginx 默认欢迎页 | `sites-enabled/default` 还在，`rm -f /etc/nginx/sites-enabled/default` 后 reload |
| 首页 403 Forbidden | 目录权限或属主不对：`chown -R www-data:www-data /var/www/portfolio` |
| 首页白屏、控制台报 404 | `build/` 里的内容没传到根目录，检查 `/var/www/portfolio/index.html` 是否存在 |
| 刷新 `/edit` 变 404 | `try_files` 那行没生效，`nginx -t` 后 reload |
| 改了 JSON 但页面没变 | 浏览器缓存，Ctrl+F5 强刷；`/profile/` 已配置 no-cache |
| scp 上传特别慢 | 1.7MB 图片占大头，属正常；后续可考虑图片转 WebP |

---

## 后续可选：绑定域名 + HTTPS

需要：备案过的域名 → 解析 A 记录到 `47.93.0.203` → 把 `server_name` 改成域名 → 用 certbot 申请免费证书：

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

`certbot` 会自动改写 Nginx 配置并加上 443 与自动续期。
