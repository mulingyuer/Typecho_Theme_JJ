# 从 SQL 文件恢复本地 MySQL 数据库
# 用法：在 docker 目录下执行
#   ./backup/restore.ps1 ./backup/typecho-20260921-120000.sql
# 或恢复线上导出的备份（会自动把站点 URL 替换为 https://jj.test）：
#   ./backup/restore.ps1 ./backup.sql -UpdateSiteUrl

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$SqlFile,

    [Parameter()]
    [switch]$UpdateSiteUrl
)

$ErrorActionPreference = 'Stop'

$DevEnvDir = Split-Path -Parent $PSScriptRoot
$ResolvedSqlFile = Resolve-Path $SqlFile

Push-Location $DevEnvDir
try {
    Write-Host "正在从 $ResolvedSqlFile 恢复数据库 ..."
    # 先拷贝到容器内再执行，避免 PowerShell 管道转写引入编码问题（BOM / 换行符）
    $ContainerSqlFile = "/tmp/restore-$(Get-Date -Format 'yyyyMMddHHmmss').sql"
    docker compose cp $ResolvedSqlFile "mysql:$ContainerSqlFile"
    docker compose exec -T mysql sh -c "mysql -uroot -proot typecho < $ContainerSqlFile"
    docker compose exec -T mysql rm -f $ContainerSqlFile
    Write-Host "恢复完成。"

    if ($UpdateSiteUrl) {
        Write-Host "正在更新站点 URL 为 https://jj.test ..."
        docker compose exec -T mysql mysql -uroot -proot typecho -e "UPDATE typecho_options SET value='https://jj.test' WHERE name='siteUrl';"
        Write-Host "站点 URL 已更新。"
    }
}
finally {
    Pop-Location
}
