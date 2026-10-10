# Typecho 本地开发环境使用说明

基于 Docker Compose 的 Typecho 本地开发环境。主题挂载的是 `docker/themes/Typecho_Theme_JJ/`（构建产物 `dist/` 会在每次构建后自动同步到该目录），插件、配置文件挂载本地目录，改动即时生效。

## 环境组成

| 服务       | 镜像                                | 容器名                  | 说明                                                  |
| ---------- | ----------------------------------- | ----------------------- | ----------------------------------------------------- |
| typecho    | `joyqi/typecho:1.3.0-php8.2-apache` | `typecho-mysql57`       | Typecho 官方镜像（PHP 8.2 + Apache），站点目录 `/app` |
| caddy      | `caddy:2-alpine`                    | `typecho-mysql57-caddy` | 反向代理，提供 HTTPS 访问（`https://jj.test`）        |
| mysql      | `mysql:5.7`                         | `typecho-mysql57-db`    | 数据库，数据持久化在 `mysql-data/`                    |
| phpmyadmin | `phpmyadmin:latest`                 | `typecho-mysql57-pma`   | Web 数据库管理面板，访问 `http://localhost:8080`      |

> **环境隔离**：四套环境（mysql57 / mysql80 / pgsql / sqlite）通过 compose 顶层 `name:` 字段拥有独立项目名与容器名（命名规范 `typecho-<环境>[-db|-pma|-caddy]`），`docker ps` 可直接区分当前环境，网络与数据卷互不共享。除 MySQL 5.7 外，还支持 **MySQL 8.0**、**SQLite**、**PostgreSQL 16** 三种数据库切换，详见下文「切换数据库环境」。

## 目录结构

```
docker/
├── docker-compose.yml        # 服务编排（入库共享）
├── docker-compose.mysql80.yml # MySQL 8.0 覆盖配置（入库共享）
├── docker-compose.sqlite.yml  # SQLite 覆盖配置（入库共享）
├── docker-compose.pgsql.yml   # PostgreSQL 覆盖配置（入库共享）
├── Caddyfile                 # Caddy 反向代理配置（入库共享）
├── certs/                    # mkcert 证书目录（本地生成，git 忽略）
│   ├── jj.test.pem           # 证书
│   └── jj.test-key.pem       # 私钥
├── config.inc.example.php    # 配置占位模板（入库共享）
├── config.inc.php            # Typecho 配置文件（本地生成，git 忽略）
├── plugins/                  # 本地插件目录 → /app/usr/plugins（内容 git 忽略）
├── themes/                   # 本地主题目录 → /app/usr/themes（内容 git 忽略）
│   └── Typecho_Theme_JJ/     # JJ 主题产物（构建后自动从 dist 同步，勿手动编辑）
├── mysql-data/               # MySQL 5.7 数据（本地生成，git 忽略）
├── mysql-data-80/            # MySQL 8.0 数据（本地生成，git 忽略，切到 8.0 时生成）
├── pgsql-data/               # PostgreSQL 16 数据（本地生成，git 忽略，切到 PG 时生成）
├── sqlite-data/              # SQLite 数据文件（本地生成，git 忽略，切到 SQLite 时生成）
├── backup/                   # 数据库备份/恢复脚本与备份文件（备份文件 git 忽略）
│   ├── backup.ps1            # 备份数据库
│   └── restore.ps1           # 恢复数据库
├── seed.php                  # 三库通用的 Typecho 测试数据生成脚本
├── seed.ps1                  # 选择容器并执行测试数据脚本
└── README.md                 # 本文档
```

挂载关系：

| 本地路径                | 容器路径              | 用途     |
| ----------------------- | --------------------- | -------- |
| `docker/themes/`        | `/app/usr/themes`     | 主题     |
| `docker/plugins/`       | `/app/usr/plugins`    | 插件     |
| `docker/config.inc.php` | `/app/config.inc.php` | 配置文件 |

> - `docker/themes/` 整目录挂载，可放入任意多个主题（如 Typecho 自带的 `default`、`classic-22`），后台「外观」中即可切换；
> - 其中 `Typecho_Theme_JJ/` 是构建同步产物（theme-assembler 每次构建后从 `dist/` 先删后拷同步，**只动这个子目录，不影响其他主题**），请勿手动编辑，改动会被下次构建覆盖；
> - 主题/插件目录只挂载产物与资源，容器内不会出现 `src/`、`node_modules/` 等开发文件。

## 首次启动

### 1. 构建主题产物

容器挂载的是构建产物，启动前必须先生成：

```powershell
# 在仓库根目录执行
pnpm install
pnpm build
```

> 构建输出到仓库根 `dist/`，随后由 theme-assembler 插件自动同步到 `docker/themes/Typecho_Theme_JJ/`（先整体删除再复制，保证无旧文件残留）。
> 后续持续开发时建议改用 `pnpm dev`（watch 模式）常驻，改动会自动重新构建并同步。

### 2. 准备配置占位文件

`docker-compose.yml` 挂载的 `config.inc.php` 需要预先存在（bind mount 目标）。首次使用前，从模板复制一份：

```powershell
cd docker
Copy-Item config.inc.example.php config.inc.php
```

### 3. 配置本地域名

用**管理员权限**编辑 `C:\Windows\System32\drivers\etc\hosts`，添加：

```
127.0.0.1   jj.test
```

> 确认宿主机 80/443 端口未被占用（关闭本地 IIS / Nginx / Laragon / Skype 等占用端口的服务）。

### 4. 启动

```powershell
docker compose up -d
```

`docker-compose.yml` 中 `TYPECHO_INSTALL: 1`，首次启动会**自动完成安装**，无需走安装向导。管理员账号：

- 用户名：`admin`
- 密码：`admin123`

### 5. 导出配置文件

安装完成后，把容器内生成的正式配置导出到本地（之后即可在 IDE 中直接编辑并即时生效）：

```powershell
docker compose cp typecho:/app/config.inc.php ./config.inc.php
```

### 6. 关闭自动安装并重启

把 `docker-compose.yml` 中的 `TYPECHO_INSTALL: 1` 改为 `0`，然后：

```powershell
docker compose up -d
```

### 7. 启用主题

访问 `https://jj.test/admin`，登录后在「控制台 → 外观」中启用 **JJ** 主题。

### 8. 配置本地 HTTPS（mkcert，仅需一次）

本环境通过 Caddy 反向代理 + mkcert 本地受信证书提供 `https://jj.test` 访问，使 `window.isSecureContext === true`，从而可以使用 `navigator.clipboard` 等要求安全上下文的现代浏览器 API。

#### 8.1 安装 mkcert

```powershell
winget install FiloSottile.mkcert
# 或：choco install mkcert / scoop install mkcert
```

#### 8.2 生成证书

```powershell
# 安装本地 CA 到系统信任库（需要管理员权限）
mkcert -install

# 生成域名证书（在 docker/certs/ 目录执行）
cd docker
mkdir certs
cd certs
mkcert jj.test
# 产出 jj.test.pem 和 jj.test-key.pem（已加入 .gitignore，不入库）
```

> 证书有效期约 2 年，过期后重新执行 `mkcert jj.test` 即可。

#### 8.3 启动服务

```powershell
docker compose down
docker compose up -d
```

访问 `https://jj.test`，浏览器应显示安全锁图标，无警告。

#### 8.4 验证安全上下文

在浏览器控制台执行：

```javascript
console.log(window.isSecureContext); // 应输出 true
console.log(navigator.clipboard); // 应输出 Clipboard 对象
```

#### 8.5 切换回 HTTP（测试降级路径）

如需测试 HTTP 降级路径（如 `execCommand`），临时修改 `Caddyfile`：

```caddyfile
http://jj.test {
    reverse_proxy typecho:80
}
```

重启 Caddy：

```powershell
docker compose restart caddy
```

访问 `http://jj.test` 即可测试降级路径。测试完成后改回 HTTPS 配置并重启。

> **团队协作说明**：证书由 mkcert 在本地生成且不入库，每位协作者首次拉取代码后需自行执行 8.1 和 8.2 两步；未生成证书时 Caddy 容器会因缺少证书文件而启动失败，但不影响 typecho/mysql 等其余服务。

## 日常开发

标准工作流（两个终端各常驻一个进程）：

```powershell
# 终端 1：启动容器环境（在 docker/ 目录）
docker compose up -d

# 终端 2：启动构建 watch（在仓库根目录，持续输出到 dist/ 并同步到 docker/themes/）
pnpm dev
```

之后：

- 改 `src/` 下任意 PHP / TS / SCSS 文件 → watch 自动重新构建到 `dist/` 并同步到 `docker/themes/Typecho_Theme_JJ/` → 刷新 `https://jj.test` 即时生效；
- 改 `docker/plugins/` 下的插件 → 即时生效；
- 改 `docker/config.inc.php` → 即时生效。

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

把线上导出的 `backup.sql` 放到 `docker/` 下，然后：

```powershell
Get-Content backup.sql | docker compose exec -T mysql mysql -uroot -proot typecho
```

> 导入后如果线上站点 URL 与本地不同，需更新数据库中的站点地址：
>
> ```powershell
> docker compose exec mysql mysql -uroot -proot typecho -e "UPDATE typecho_options SET value='https://jj.test' WHERE name='siteUrl';"
> ```

## phpMyAdmin 管理面板

环境已内置 phpMyAdmin，启动后访问 `http://localhost:8080`：

- 用户名 / 密码：`root` / `root`
- 登录页无需选择服务器，phpMyAdmin 通过 Docker 内部网络自动连接当前运行的 MySQL 实例

> 由于两个 MySQL 版本不会同时运行（切换前需要 `down`），phpMyAdmin 会始终连接当前启动的那个版本，无需手动切换。

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

## 切换数据库环境

本主题代码层面对 MySQL / PostgreSQL / SQLite 天然兼容（所有查询均走 Typecho DAL），因此可以通过覆盖配置快速切换三种数据库环境做回归测试。

### 环境矩阵

| 环境              | 项目名            | 启动命令                                                                   | 数据目录                 | 说明                 |
| ----------------- | ----------------- | -------------------------------------------------------------------------- | ------------------------ | -------------------- |
| MySQL 5.7（默认） | `typecho-mysql57` | `docker compose up -d`                                                     | `mysql-data/`            | 开发基准环境         |
| MySQL 8.0         | `typecho-mysql80` | `docker compose -f docker-compose.yml -f docker-compose.mysql80.yml up -d` | `mysql-data-80/`         | 验证 MySQL 8.0 兼容  |
| SQLite            | `typecho-sqlite`  | `docker compose -f docker-compose.sqlite.yml up -d`                        | `sqlite-data/typecho.db` | 单容器，无数据库服务 |
| PostgreSQL 16     | `typecho-pgsql`   | `docker compose -f docker-compose.yml -f docker-compose.pgsql.yml up -d`   | `pgsql-data/`            | 验证 PG 严格模式兼容 |

> 切换前必须先 `docker compose down`（在**当前运行环境对应的项目**下执行，如 `docker compose -f docker-compose.sqlite.yml down`），避免端口与数据目录冲突。
> 各环境项目名独立（compose 顶层 `name:` 字段），数据卷与网络互不共享；容器名遵循 `typecho-<环境>[-db|-pma|-caddy]` 规范，`docker ps` 可直接辨认当前环境。

> **HTTPS 说明**：Caddy 反向代理在所有数据库环境中均可使用，切换数据库时无需修改 Caddy 配置。各覆盖文件中的 `TYPECHO_SITE_URL` 已统一为 `https://jj.test`。

### SQLite 环境

```powershell
docker compose down
docker compose -f docker-compose.sqlite.yml up -d
```

- 数据库文件：`./sqlite-data/typecho.db`
- 无需额外数据库容器，适合快速验证轻量场景。

### PostgreSQL 16 环境

```powershell
docker compose down
docker compose -f docker-compose.yml -f docker-compose.pgsql.yml up -d
```

- 数据目录：`./pgsql-data/`
- PG 对 `GROUP BY`、类型比较比 MySQL 严格，适合验证复杂查询的跨库兼容性。

### 三库环境共同点

- 管理员账号均为 `admin` / `admin123`；
- 首次启动自动执行安装（`TYPECHO_INSTALL=1`），已有表时跳过（`TYPECHO_DB_NEXT=keep`）；
- 主题与插件挂载方式与默认环境一致，改代码即时生效。

## 生成分页测试数据

`seed.php` 使用 Typecho 数据库查询构造器，可在 MySQL 5.7/8.0、PostgreSQL 和 SQLite 环境复用。`seed.ps1` 会自动选择唯一运行中的 Typecho 容器；也可以用 `-Env` 显式指定环境：

```powershell
# 生成测试数据（执行前自动清理旧的 seed- 测试数据）
.\docker\seed.ps1
.\docker\seed.ps1 -Env mysql57

# 仅清理脚本生成的数据
.\docker\seed.ps1 -Env mysql57 -Clean
```

数据包含 60 篇文章、30 个分类、25 个标签、每篇 1–10 条评论（部分为嵌套回复）、3 篇独立页，以及主题使用的 `views`、`likes`、`titleImg` 自定义字段。清理只匹配 `seed-post-`、`seed-page-`、`seed-cat-` 和 `seed-tag-` 前缀，不会删除其他内容。执行前请确认目标库允许写入；清理操作不可恢复，建议先备份需要保留的数据。

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

# 恢复线上导出的备份，并自动把站点 URL 替换为 https://jj.test
./backup/restore.ps1 ./backup.sql -UpdateSiteUrl
```

> 备份/恢复脚本内部使用 `docker compose cp` + 容器内文件读写，不经 PowerShell 管道转写，避免 UTF-8 BOM 与换行符问题。

## 常见问题

**Q：访问 `https://jj.test` 打不开？**

- 检查 hosts 是否配置且保存成功：`ping jj.test` 应解析到 `127.0.0.1`；
- 检查容器是否运行：`docker compose ps`（caddy 容器应为 Up 状态）；
- 检查 80/443 端口冲突：`netstat -ano | findstr :443`；
- 检查证书是否存在：`docker/certs/` 下应有 `jj.test.pem` 和 `jj.test-key.pem`，缺失则按「配置本地 HTTPS」章节重新生成；
- 查看 Caddy 日志：`docker compose logs caddy`。

**Q：浏览器提示证书不受信任？**

- 确认已执行 `mkcert -install` 安装本地 CA（需要管理员权限）；
- Firefox 使用独立证书库，需额外在 Firefox 设置中导入 mkcert CA（`mkcert -CAROOT` 查看 CA 路径）。

**Q：后台「外观」里看不到 JJ 主题 / 页面报错主题缺失？**

- 容器挂载的是 `docker/themes/` 整目录，其中 JJ 主题为构建同步产物，先确认已执行 `pnpm build`（或 `pnpm dev` 常驻）且 `docker/themes/Typecho_Theme_JJ/` 有内容；
- 用 `docker compose exec typecho ls /app/usr/themes/Typecho_Theme_JJ` 确认挂载内容，应看到 `index.php`、`functions.php`、`modules/` 等主题产物。

**Q：主题/插件改了没生效？**

- 确认 `pnpm dev`（watch 模式）正在运行，改动会自动重新构建并同步到 `docker/themes/Typecho_Theme_JJ/`（只覆盖该子目录，其他主题不受影响）；
- 手动放入 `docker/themes/` 的其他主题、`docker/plugins/` 的插件改动即时生效；
- 确认挂载是否生效：`docker compose exec typecho ls /app/usr/themes/Typecho_Theme_JJ` 应看到主题产物文件；
- PHP 文件改动一般即时生效；如开启了 OPcache 缓存可 `docker compose restart typecho`。

**Q：数据库数据想清空重来？**

```powershell
# MySQL 5.7 环境
docker compose down
Remove-Item -Recurse -Force mysql-data
docker compose up -d

# 其他环境同理，替换为对应的数据目录（mysql-data-80 / pgsql-data / sqlite-data）
# 并使用对应的 -f 参数执行 down / up
```

**Q：需要 HTTPS？**

环境已内置 Caddy + mkcert 提供 `https://jj.test` 访问，详见上文「配置本地 HTTPS」章节。
