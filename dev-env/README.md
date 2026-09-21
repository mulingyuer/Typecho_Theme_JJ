# Typecho 本地开发环境使用说明

基于 Docker Compose 的 Typecho 本地开发环境，主题、插件、配置文件均挂载本地目录，改动即时生效。

## 环境组成

| 服务 | 镜像 | 说明 |
| --- | --- | --- |
| typecho | `joyqi/typecho:1.3.0-php8.2-apache` | Typecho 官方镜像（PHP 8.2 + Apache），站点目录 `/app` |
| mysql | `mysql:5.7` | 数据库，数据持久化在 `mysql-data/` |

## 目录结构

```
dev-env/
├── docker-compose.yml        # 服务编排（入库共享）
├── docker-compose.mysql80.yml # MySQL 8.0 覆盖配置（入库共享）
├── config.inc.example.php    # 配置占位模板（入库共享）
├── config.inc.php            # Typecho 配置文件（本地生成，git 忽略）
├── plugins/                  # 本地插件目录 → /app/usr/plugins（内容 git 忽略）
├── mysql-data/               # MySQL 5.7 数据（本地生成，git 忽略）
├── backup/                   # 数据库备份/恢复脚本与备份文件（备份文件 git 忽略）
│   ├── backup.ps1            # 备份数据库
│   └── restore.ps1           # 恢复数据库
└── README.md                 # 本文档
```

挂载关系：

| 本地路径 | 容器路径 | 用途 |
| --- | --- | --- |
| 仓库根目录（`../`） | `/app/usr/themes/JJ` | 主题 |
| `dev-env/plugins/` | `/app/usr/plugins` | 插件 |
| `dev-env/config.inc.php` | `/app/config.inc.php` | 配置文件 |

## 首次启动

### 1. 准备配置占位文件

`docker-compose.yml` 挂载的 `config.inc.php` 需要预先存在（bind mount 目标）。首次使用前，从模板复制一份：

```powershell
cd dev-env
Copy-Item config.inc.example.php config.inc.php
```

### 2. 配置本地域名

用**管理员权限**编辑 `C:\Windows\System32\drivers\etc\hosts`，添加：

```
127.0.0.1   jj.test
```

> 确认宿主机 80 端口未被占用（关闭本地 IIS / Nginx / Laragon 等占用 80 的服务）。
> 若必须占用 80，可把 `docker-compose.yml` 的端口改为 `"8080:80"`，并把 `TYPECHO_SITE_URL` 改为 `http://jj.test:8080`。

### 3. 启动

```powershell
docker compose up -d
```

`docker-compose.yml` 中 `TYPECHO_INSTALL: 1`，首次启动会**自动完成安装**，无需走安装向导。管理员账号：

- 用户名：`admin`
- 密码：`admin123`

### 4. 导出配置文件

安装完成后，把容器内生成的正式配置导出到本地（之后即可在 IDE 中直接编辑并即时生效）：

```powershell
docker compose cp typecho:/app/config.inc.php ./config.inc.php
```

### 5. 关闭自动安装并重启

把 `docker-compose.yml` 中的 `TYPECHO_INSTALL: 1` 改为 `0`，然后：

```powershell
docker compose up -d
```

### 6. 启用主题

访问 `http://jj.test/admin`，登录后在「控制台 → 外观」中启用 **JJ** 主题。

## 日常开发

```powershell
# 1. 启动环境（在 dev-env 目录）
docker compose up -d

# 2. 启动前端编译 watch（在仓库根目录）
pnpm dev
```

之后：

- 改主题的 PHP / TS / SCSS 文件 → 刷新 `http://jj.test` 即时生效；
- 改 `plugins/` 下的插件 → 即时生效；
- 改 `config.inc.php` → 即时生效。

结束开发：

```powershell
docker compose down        # 停止容器（数据保留）
```

## 常用命令

```powershell
docker compose ps                    # 查看容器状态
docker compose logs -f typecho       # 查看 Typecho 日志
docker compose logs -f mysql         # 查看 MySQL 日志
docker compose restart typecho       # 重启 Typecho 容器
docker compose exec mysql mysql -uroot -proot typecho   # 进入数据库命令行
```

## 导入线上数据库（可选）

把线上导出的 `backup.sql` 放到 `dev-env/` 下，然后：

```powershell
Get-Content backup.sql | docker compose exec -T mysql mysql -uroot -proot typecho
```

> 导入后如果线上站点 URL 与本地不同，需更新数据库中的站点地址：
>
> ```powershell
> docker compose exec mysql mysql -uroot -proot typecho -e "UPDATE typecho_options SET value='http://jj.test' WHERE name='siteUrl';"
> ```

## 切换 MySQL 8.0（可选）

默认使用 MySQL 5.7 作为开发基准。如需验证主题在 MySQL 8.0 下的兼容性，使用 [docker-compose.mysql80.yml](docker-compose.mysql80.yml) 覆盖配置：

```powershell
# 先停止当前环境，避免端口和数据目录冲突
docker compose down

# 使用 MySQL 8.0 启动（使用独立数据目录 ./mysql-data-80）
docker compose -f docker-compose.yml -f docker-compose.mysql80.yml up -d
```

验证要点：

- 覆盖文件已指定 `--default-authentication-plugin=mysql_native_password`，规避 MySQL 8.0 默认的 `caching_sha2_password` 认证插件与旧驱动的兼容问题；
- 确认主题安装、文章发布、评论、附件上传等核心流程正常；
- 留意 `utf8mb4` 字符集与排序规则在 8.0 下的行为差异。

切回 MySQL 5.7：

```powershell
docker compose down
docker compose up -d
```

> 两个版本的数据目录互相独立（`mysql-data/` 与 `mysql-data-80/`），切换不会互相污染。

## 备份与恢复

### 备份

```powershell
./backup/backup.ps1
```

在 `backup/` 目录生成 `typecho-yyyyMMdd-HHmmss.sql`。

### 恢复

```powershell
# 恢复本地备份
./backup/restore.ps1 ./backup/typecho-20260921-120000.sql

# 恢复线上导出的备份，并自动把站点 URL 替换为 http://jj.test
./backup/restore.ps1 ./backup.sql -UpdateSiteUrl
```

## 常见问题

**Q：访问 `http://jj.test` 打不开？**

- 检查 hosts 是否配置且保存成功：`ping jj.test` 应解析到 `127.0.0.1`；
- 检查容器是否运行：`docker compose ps`；
- 检查 80 端口冲突：`netstat -ano | findstr :80`。

**Q：主题/插件改了没生效？**

- 确认挂载是否生效：`docker compose exec typecho ls /app/usr/themes/JJ` 应看到仓库文件；
- PHP 文件改动一般即时生效；如开启了 OPcache 缓存可 `docker compose restart typecho`。

**Q：数据库数据想清空重来？**

```powershell
docker compose down
Remove-Item -Recurse -Force mysql-data
docker compose up -d
```

**Q：需要 HTTPS？**

开发阶段一般不需要。如确实需要（例如调试某些强制 HTTPS 的功能），可用 Caddy 或 mkcert 自签证书在宿主机做一层反向代理到容器 80 端口。
