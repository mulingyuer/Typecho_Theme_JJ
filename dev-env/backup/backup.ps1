# 备份本地 MySQL 数据库到 backup/ 目录
# 用法：在 dev-env 目录下执行
#   ./backup/backup.ps1
# 生成的文件：backup/typecho-yyyyMMdd-HHmmss.sql

$ErrorActionPreference = 'Stop'

$DevEnvDir = Split-Path -Parent $PSScriptRoot
$BackupDir = $PSScriptRoot
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$OutFile = Join-Path $BackupDir "typecho-$Timestamp.sql"

Push-Location $DevEnvDir
try {
    Write-Host "正在备份数据库到 $OutFile ..."
    docker compose exec -T mysql mysqldump -uroot -proot typecho | Out-File -FilePath $OutFile -Encoding utf8
    Write-Host "备份完成：$OutFile"
}
finally {
    Pop-Location
}
